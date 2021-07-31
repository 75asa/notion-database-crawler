import { PrismaClient } from "@prisma/client";
import { Slack } from "./Slack";
import { NotionRepository } from "./NotionRepository";
import { Scheduler } from "./Scheduler";
import { Config } from "./Config";

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
      const hadStoredDatabase = await prisma.database.findFirst({
        where: {
          id: database.props.id,
        },
        include: {
          pages: {
            include: {
              LastEditedBy: true,
            },
          },
        },
      });
      // 前回同期した時間で Notion Page をフィルタ
      let isFirstTime = true;

      // DB保存済みの場合
      if (hadStoredDatabase) {
        isFirstTime = false;
        database.lastFetchedAt = hadStoredDatabase.lastFetchedAt;
      }
      const allContents = await notionRepo.getAllContentsFromDatabase(
        database.props.id,
        database.props.lastFetchedAt
      );

      database.size = allContents.length;
      // Database に Page [] があり、 DB に保存してない場合
      if (isFirstTime) {
        // 初期登録
        try {
          await prisma.database.create({
            data: database.props,
          });
        } catch (e) {
          throw e;
        }
        if (!database.size) return;
        for (const page of allContents) {
          const { userId, databaseId, ...refinedPage } = page.page.props;
          try {
            await prisma.page.create({
              data: {
                ...refinedPage,
                Database: {
                  connect: {
                    id: databaseId,
                  },
                },
                LastEditedBy: {
                  connectOrCreate: {
                    where: {
                      id: userId,
                    },
                    create: page.user.props,
                  },
                },
              },
              include: {
                Database: true,
                LastEditedBy: true,
              },
            });
          } catch (e) {
            throw e;
          }
        }
      } else if (hadStoredDatabase !== null) {
        // database に紐づいたページを取得
        const hadStoredPages = hadStoredDatabase.pages;

        // 2回目以降なので差分を比較
        const notStoredPages = allContents.filter(pageSet => {
          const hadStored = hadStoredPages.some(storedPage => {
            return storedPage.id === pageSet.page.props.id;
          });
          if (hadStored) return false;
          return hadStored;
        });
        // 差分がない場合は何もしない
        if (!notStoredPages.length) {
          try {
            await prisma.database.update({
              where: { id: database.props.id },
              data: database.props,
            });
          } catch (e) {
            throw e;
          } finally {
            return;
          }
        }

        database.size += notStoredPages.length;

        for (const pageAndUser of notStoredPages) {
          const lastEditedBy = pageAndUser.user;
          const page = pageAndUser.page;
          const { userId, databaseId, ...refinedPage } = pageAndUser.page.props;
          try {
            await prisma.page.create({
              data: {
                ...refinedPage,
                Database: {
                  connect: {
                    id: databaseId,
                  },
                },
                LastEditedBy: {
                  connectOrCreate: {
                    where: {
                      id: userId,
                    },
                    create: lastEditedBy.props,
                  },
                },
              },
              include: {
                Database: true,
                LastEditedBy: true,
              },
            });
          } catch (e) {
            throw e;
          }
          const slackClient = new Slack();
          // Slack 通知
          // const databaseName = hadStoredDatabase.name || "";
          slackClient.postMessage({
            databaseName: database.props.name,
            page,
            user: lastEditedBy,
          });
        }
        // Database 更新
        try {
          await prisma.database.update({
            where: { id: database.props.id },
            data: database.props,
          });
        } catch (e) {
          throw e;
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
