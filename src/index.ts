import { PrismaClient } from "@prisma/client";
import { Slack } from "./Slack";
import { Scheduler } from "./Scheduler";
import { Config } from "./Config";
import {
  NotionRepository,
  PrismaDatabaseRepository,
  PrismaPageRepository,
} from "./repository";

const prisma = new PrismaClient();

const main = async () => {
  console.log("main:start");
  await prisma.$connect();
  const notionRepo = new NotionRepository(Config.Notion.KEY);
  // integration が取得可能な prisma database
  const allDatabases = await notionRepo.getAllDatabase();
  // database に紐づいてる Page (from Notion)
  await Promise.all(
    allDatabases.map(async database => {
      const databaseRepo = new PrismaDatabaseRepository(prisma);
      const storedDatabase = await databaseRepo.find(database.id);
      const isFirstTime = storedDatabase ? false : true;
      const allContents = await notionRepo.getAllContentsFromDatabase(
        database.id
      );

      database.size = allContents.length;
      // Database に Page [] があり、 DB に保存してない場合
      if (isFirstTime) {
        // 初期登録
        await databaseRepo.create(database);
        if (!database.size) return;
        const pageRepo = new PrismaPageRepository(prisma);
        for (const content of allContents) {
          const user = content.user;
          const page = content.page;
          await pageRepo.create(page, user);
        }
      } else if (storedDatabase !== null) {
        // database に紐づいたページを取得
        const storedPages = storedDatabase.pages;

        // 2回目以降なので差分を比較
        const unstoredPages = allContents.filter(content => {
          const hadStored = storedPages.some(storedPage => {
            return storedPage.id === content.page.id;
          });
          //  DBに一つでも同じIDがあれば保存ずみなので false を返す
          return hadStored ? false : true;
        });
        // 差分がない場合は何もしない
        if (!unstoredPages.length) {
          try {
            await databaseRepo.update(database);
          } finally {
            return;
          }
        }

        database.size += unstoredPages.length;
        const pageRepo = new PrismaPageRepository(prisma);

        for (const pageAndUser of unstoredPages) {
          const user = pageAndUser.user;
          const page = pageAndUser.page;
          await pageRepo.create(page, user);
          const slackClient = new Slack();
          // Slack 通知
          await slackClient.postMessage({
            databaseName: database.name,
            page,
            user,
          });
        }
        // Database 更新
        try {
          await databaseRepo.update(database);
        } finally {
          return;
        }
      }
    })
  );
  console.log("main:end");
};

const job = new Scheduler(main);
job.setInterval({ seconds: Config.JOB_INTERVAL_SECONDS });
