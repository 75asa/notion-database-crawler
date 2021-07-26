import { Prisma, PrismaClient, User } from "@prisma/client";
import { Slack } from "./Slack";
import { Notion } from "./Notion";
import { Scheduler } from "./Scheduler";
import { Config } from "./Config";

const prisma = new PrismaClient();

const main = async () => {
  console.log("main:start");
  await prisma.$connect();
  const notion = new Notion(Config.Notion.KEY);
  // integration が取得可能な database (from Notion)
  const allNotionDatabases = await notion.getAllDatabase();
  // database に紐づいてる Page (from Notion)
  await Promise.all(
    allNotionDatabases.map(async databaseDTO => {
      const updateArgs: Prisma.DatabaseUpdateArgs = {
        data: {
          size: databaseDTO.size,
          lastFetchedAt: new Date(),
          lastEditedAt: databaseDTO.lastEditedAt,
        },
        where: { id: databaseDTO.id },
      };
      const hadStoredDatabase = await prisma.database.findFirst({
        where: {
          id: databaseDTO.id,
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
        // TODO: 型情報みる
        updateArgs.data.lastFetchedAt = hadStoredDatabase.lastFetchedAt;
        isFirstTime = false;
        updateArgs.where.id = hadStoredDatabase.id;
      }
      const pagesDTO = await notion.getAllPagesFromNotionDatabase(
        databaseDTO.id,
        updateArgs.data.lastFetchedAt as Date
      );

      databaseDTO.pages = pagesDTO;
      databaseDTO.size = pagesDTO.length;

      // Database に Page [] があり、 DB に保存してない場合
      if (isFirstTime) {
        updateArgs.where.id = databaseDTO.id;
        // 初期登録
        await prisma.database.create({
          data: {
            id: databaseDTO.id,
            name: databaseDTO.name!,
            lastFetchedAt: updateArgs.data.lastFetchedAt as Date,
            createdAt: databaseDTO.createdAt,
            lastEditedAt: databaseDTO.lastEditedAt,
            size: databaseDTO.size,
          },
        });
        if (databaseDTO.size) {
          for (const page of databaseDTO.pages) {
            prisma.page.create({
              data: {
                id: page.id,
                name: page.name!,
                createdAt: page.createdAt,
                url: page.url,
                Database: {
                  connect: {
                    id: page.databaseId,
                  },
                },
                LastEditedBy: {
                  connectOrCreate: {
                    where: {
                      id: page.lastEditedBy!.id,
                    },
                    create: {
                      id: page.lastEditedBy!.id,
                      name: page.lastEditedBy!.name!,
                      avatarURL: page.lastEditedBy!.avatarURL!,
                      email: page.lastEditedBy!.email!,
                    },
                  },
                },
              },
              include: {
                Database: true,
                LastEditedBy: true,
              },
            });
          }
        }
      } else if (hadStoredDatabase !== null) {
        // database に紐づいたページを取得
        const hadStoredPages = hadStoredDatabase.pages;

        const userMap = new Map<string, User>();
        // 2回目以降なので差分を比較
        const pages = databaseDTO.pages
          .map(page => {
            const hadStored = hadStoredPages.some(storedPage => {
              return storedPage.id === page.id;
            });
            if (hadStored) return;
            return page;
          })
          .filter((item): item is Exclude<typeof item, undefined> => {
            return item !== undefined;
          });
        if (pages.length) {
          updateArgs.data.size = pages.length;
          for (const page of pages) {
            const lastEditedBy = page.lastEditedBy!;
            const result = await prisma.page.create({
              data: {
                id: page.id,
                name: page.name!,
                createdAt: page.createdAt,
                url: page.url,
                Database: {
                  connect: {
                    id: page.databaseId,
                  },
                },
                LastEditedBy: {
                  connectOrCreate: {
                    where: {
                      id: lastEditedBy!.id,
                    },
                    create: {
                      id: lastEditedBy!.id,
                      name: lastEditedBy!.name!,
                      avatarURL: lastEditedBy!.avatarURL!,
                      email: lastEditedBy!.email!,
                    },
                  },
                },
              },
              include: {
                Database: true,
                LastEditedBy: true,
              },
            });
            const slackClient = new Slack();
            // Slack 通知
            const databaseName = hadStoredDatabase.name || "";
            if (lastEditedBy) {
              slackClient.postMessage({
                databaseName,
                page: {
                  name: page.name,
                  url: page.url,
                  createdAt: page.createdAt,
                },
                user: result.LastEditedBy,
              });
            } else {
              slackClient.postMessage({
                databaseName,
                page: {
                  name: page.name,
                  url: page.url,
                  createdAt: page.createdAt,
                },
                user: result.LastEditedBy,
              });
            }
          }
        }
        // Database 更新
        await prisma.database.update(updateArgs);
      }
    })
  );
  console.log("main:end");
};

const job = new Scheduler(main);
job.setInterval({ seconds: Config.JOB_INTERVAL_SECONDS });
