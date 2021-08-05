import { PrismaClient } from "@prisma/client";
import { Slack } from "./Slack";
import { NotionRepository } from "./repository/NotionRepository";
import { Scheduler } from "./Scheduler";
import { Config } from "./Config";
import { PrismaPageRepository } from "./repository/PrismaPageRepository";
import { PrismaDatabaseRepository } from "./repository/PrismaDatabaseRepository";
import { ContentBlock } from "./model/valueObject/ContentsBlock";

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
      const hadStoredDatabase = await databaseRepo.find(database.id);
      // 前回同期した時間で Notion Page をフィルタ
      let isFirstTime = true;

      // DB保存済みの場合
      if (hadStoredDatabase) {
        isFirstTime = false;
        database.lastFetchedAt = hadStoredDatabase.lastFetchedAt;
      }
      const allContents = await notionRepo.getAllContentsFromDatabase(
        database.id,
        database.lastFetchedAt
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
      } else if (hadStoredDatabase !== null) {
        // database に紐づいたページを取得
        const hadStoredPages = hadStoredDatabase.pages;

        // 2回目以降なので差分を比較
        const notStoredPages = allContents.filter(content => {
          const hadStored = hadStoredPages.some(storedPage => {
            return storedPage.id === content.page.id;
          });
          //  DBに一つでも同じIDがあれば保存ずみなので false を返す
          return hadStored ? false : true;
        });
        // 差分がない場合は何もしない
        if (!notStoredPages.length) {
          try {
            await databaseRepo.update(database);
          } finally {
            return;
          }
        }

        database.size += notStoredPages.length;
        const pageRepo = new PrismaPageRepository(prisma);

        for (const pageAndUser of notStoredPages) {
          const user = pageAndUser.user;
          const page = pageAndUser.page;
          await pageRepo.create(page, user);
          const blocks = await notionRepo.getAllBlocksFromPage(page.id);
          const contentsBlock = ContentBlock.create(blocks);
          const slackClient = new Slack(contentsBlock);
          // slackClient.setBlocks(blocks);
          // Slack 通知
          await slackClient.postMessage({
            databaseName: database.name,
            page,
            user: user,
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
