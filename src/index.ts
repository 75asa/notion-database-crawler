import { PrismaClient } from "@prisma/client";
import { Config } from "~/Config";
import {
  NotionRepository,
  PrismaDatabaseRepository,
  PrismaPageRepository,
} from "~/repository";
import { Scheduler } from "~/Scheduler";
import { Slack } from "~/Slack";

const prisma = new PrismaClient();

const main = async () => {
  console.log("main:start");
  await prisma.$connect();
  const notionRepo = new NotionRepository(Config.Notion.KEY);
  // integration が取得可能な prisma database
  const allDatabases = await notionRepo.getAllDatabase();
  // database に紐づいてる Page (from Notion)
  await Promise.all(
    allDatabases.map(async (database) => {
      const databaseRepo = new PrismaDatabaseRepository(prisma);
      const storedDatabase = await databaseRepo.find(database.id);
      const isFirstTime =
        storedDatabase === null || storedDatabase === undefined ? true : false;
      const allContents = await notionRepo.getAllContentsFromDatabase(
        database.id
      );

      database.size = allContents.length ?? 0;
      // Database に Page [] があり、 DB に保存してない場合
      if (isFirstTime) {
        // 初期登録
        await databaseRepo.create(database);
        if (!database.size) return;
        const pageRepo = new PrismaPageRepository(prisma);
        for (const { page, user } of allContents) {
          await pageRepo.create(page, user);
        }
      } else if (storedDatabase !== null && storedDatabase !== undefined) {
        // database に紐づいたページを取得
        const storedPages = storedDatabase["Pages"];

        // 2回目以降なので差分を比較
        const unstoredPages = allContents.filter((content) => {
          const hadStored = storedPages.some((storedPage) => {
            return storedPage.id === content.page.id;
          });
          //  DBに一つでも同じIDがあれば保存済みなので false を返す
          return hadStored ? false : true;
        });
        // 差分がない場合は Database のみ更新
        if (!unstoredPages.length) {
          await databaseRepo.update(database);
          return;
        }

        database.size += unstoredPages.length;
        const pageRepo = new PrismaPageRepository(prisma);

        for (const { user, page } of unstoredPages) {
          await pageRepo.create(page, user);
          const notionBlocks = await notionRepo.getAllBlocksFromPage(page.id);
          const slackClient = new Slack(Config.Slack);
          // slackClient.setBlocks(blocks);
          // Slack 通知
          await slackClient.postMessage({
            database,
            page,
            user,
          });
        }
        // Database 更新
        await databaseRepo.update(database);
        return;
      }
    })
  );
  console.log("main:end");
};

const job = new Scheduler(main);
job.setInterval({ seconds: Config.JOB_INTERVAL_SECONDS });
