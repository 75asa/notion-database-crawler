// Find the official Notion API client @ https://github.com/makenotion/notion-sdk-js/
// npm install @notionhq/client
import dotenv from "dotenv";
import { Prisma, PrismaClient, User } from "@prisma/client";
import {
  AsyncTask,
  SimpleIntervalJob,
  SimpleIntervalSchedule,
  ToadScheduler,
} from "toad-scheduler";
import { Slack } from "./slack";
import { Notion } from "./notion";

const prisma = new PrismaClient();
const config = dotenv.config().parsed;

if (config) {
  for (const key in config) {
    process.env[key] = config[key];
  }
}

const main = async () => {
  console.log("main:start");
  await prisma.$connect();
  const notionKey = process.env!.NOTION_KEY;
  if (!notionKey) throw "Notion API Key not found";
  const notion = new Notion(notionKey);
  // integration が取得可能な database (from Notion)
  const allNotionDatabases = await notion.getAllDatabase();
  // database に紐づいてる Page (from Notion)
  const allStoredDatabases = await Promise.all(
    allNotionDatabases.map(async databaseDTO => {
      const result: { id: string; lastFetchedAt: Date } = {
        id: "",
        lastFetchedAt: new Date(),
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
      const now = new Date();
      let lastFetchedAt = now;
      let firstIntegratedAt = now;
      let isFirstTime = true;
      // 同期時間を記録
      result.lastFetchedAt = now;

      // DB保存済みの場合
      if (hadStoredDatabase) {
        // TODO: 型情報みる
        lastFetchedAt = hadStoredDatabase.lastFetchedAt;
        firstIntegratedAt = hadStoredDatabase.firstIntegratedAt;
        isFirstTime = false;
        result.id = hadStoredDatabase.id;
      }
      const pagesDTO = await notion.getAllPagesFromNotionDatabase(
        databaseDTO.id,
        lastFetchedAt
      );

      databaseDTO.pages = pagesDTO;
      databaseDTO.size = pagesDTO.length;

      // Database に Page [] があり、 DB に保存してない場合
      if (isFirstTime) {
        result.id = databaseDTO.id;
        // 初期登録
        await prisma.database.create({
          data: {
            id: databaseDTO.id,
            name: databaseDTO.name,
            lastFetchedAt,
            firstIntegratedAt,
            createdAt: databaseDTO.createdAt,
            lastEditedAt: databaseDTO.lastEditedAt,
            size: databaseDTO.size,
          },
        });
        if (databaseDTO.size) {
          for (const page of databaseDTO.pages) {
            if (page.lastEditedBy) {
              prisma.page.create({
                data: {
                  id: page.id,
                  name: page.name,
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
                        id: page.id,
                      },
                      create: {
                        id: page.lastEditedBy.id,
                        name: page.lastEditedBy.name!,
                        avatarURL: page.lastEditedBy.avatarURL!,
                        email: page.lastEditedBy.email!,
                      },
                    },
                  },
                },
                include: {
                  Database: true,
                  LastEditedBy: true,
                },
              });
            } else {
              prisma.page.create({
                data: {
                  id: page.id,
                  name: page.name,
                  createdAt: page.createdAt,
                  url: page.url,
                  Database: {
                    connect: {
                      id: page.databaseId,
                    },
                  },
                },
                include: {
                  Database: true,
                },
              });
            }
          }
        }
      } else if (hadStoredDatabase !== null) {
        // database に紐づいたページを取得
        const hadStoredPages = hadStoredDatabase.pages;

        const userMap = new Map<string, User>();
        // 2回目以降なので差分を比較
        const pageCreateInputValues = databaseDTO.pages
          .map(page => {
            const hadStored = hadStoredPages.some(storedPage => {
              return storedPage.id === page.id;
            });
            if (hadStored) return;
            const result: Prisma.PageCreateManyInput = {
              id: page.id,
              name: page?.name || "",
              databaseId: page.databaseId,
              createdAt: page.createdAt,
              url: page.url,
            };
            if (!page.lastEditedBy) return result;
            const lastEditedBy = page.lastEditedBy;
            try {
              prisma.user.upsert({
                where: {
                  id: lastEditedBy.id,
                },
                update: {
                  name: lastEditedBy.name,
                  avatarURL: lastEditedBy.avatarURL,
                  email: lastEditedBy.email,
                },
                create: {
                  id: lastEditedBy.id,
                  name: lastEditedBy.name!,
                  avatarURL: lastEditedBy.avatarURL!,
                  email: lastEditedBy.email,
                },
              });
              result.userId = lastEditedBy.id;
              userMap.set(lastEditedBy.id, {
                id: lastEditedBy.id,
                name: lastEditedBy.name!,
                avatarURL: lastEditedBy.avatarURL!,
                email: lastEditedBy?.email || null,
              });
            } catch (err) {
              throw err;
            }
            return result;
          })
          .filter((item): item is Exclude<typeof item, undefined> => {
            return item !== undefined;
          });

        if (pageCreateInputValues.length) {
          try {
            await prisma.page.createMany({
              data: pageCreateInputValues,
            });
            const slackClient = new Slack();
            // Slack 通知
            for (const value of pageCreateInputValues) {
              const databaseName = hadStoredDatabase.name || "";
              const { name, url, createdAt } = value;
              if (value.userId) {
                const user = userMap.get(value.userId);
                slackClient.postMessage({
                  databaseName,
                  page: { name, url, createdAt },
                  user,
                });
              } else {
                slackClient.postMessage({
                  databaseName,
                  page: { name, url, createdAt },
                });
              }
            }
          } catch (e) {
            throw e;
          }
        }
        // Database 更新
        await prisma.database.update({
          where: { id: result.id },
          data: { lastFetchedAt: result.lastFetchedAt, size: databaseDTO.size },
        });
      }
      return result;
    })
  );
  await prisma.database.updateMany({ where: {}, data: {} });
  console.log("main:end");
};

const scheduler = new ToadScheduler();
const task = new AsyncTask(
  "run main",
  () => {
    return main();
  },
  (err: Error) => {
    throw err;
  }
);
const simpleIntervalSchedule: SimpleIntervalSchedule = { seconds: 30 };
const job = new SimpleIntervalJob(simpleIntervalSchedule, task);

scheduler.addSimpleIntervalJob(job);
