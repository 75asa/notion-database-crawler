// Find the official Notion API client @ https://github.com/makenotion/notion-sdk-js/
// npm install @notionhq/client
import { Prisma, PrismaClient, User } from "@prisma/client";
import { Slack } from "./Slack";
import { Notion } from "./Notion";
import { UserRepository } from "./repository/UserRepository";
import { Scheduler } from "./Scheduler";
import { Config } from "./Config";
import { DatabaseRepository } from "./repository/DatabaseRepository";
import { MainUseCase } from "./UseCases/main";
import { DatabaseService } from "./service/DatabaseService";

const prisma = new PrismaClient();

const main = async () => {
  console.log("main:start");
  await prisma.$connect();
  const notion = new Notion(Config.Notion.KEY);
  // integration が取得可能な database (from Notion)
  const allNotionDatabases = await notion.getAllDatabase();
  // database に紐づいてる Page (from Notion)
  await Promise.all(
    allNotionDatabases.map(async notionDatabase => {
      // メインのユースケースをinvoke
      // await new MainUseCase(notionDatabase, databaseRepo).invoke();
      const result: Prisma.DatabaseUpdateArgs = {
        data: {
          lastFetchedAt: new Date(),
          size: 0,
          lastEditedAt: notionDatabase.last_edited_time,
        },
        where: { id: notionDatabase.id },
      };

      const databaseService = new DatabaseService(
        notionDatabase,
        new DatabaseRepository()
      );
      const initResult = await databaseService.init();
      const hadStoredDatabaseIncludeAllRelations =
        await databaseRepo.findStoredDatabaseIncludeAllRelations(
          notionDatabase.id
        );
      let isFirstTime = true;

      // TODO: UseCase 化
      // DB保存済みの場合
      if (hadStoredDatabaseIncludeAllRelations) {
        // TODO: 型情報みる
        result.data.lastFetchedAt =
          hadStoredDatabaseIncludeAllRelations.lastFetchedAt;
        isFirstTime = false;
        result.data.id = hadStoredDatabaseIncludeAllRelations.id;
      }
      // 前回同期した時間で Notion Page をフィルタ
      const pagesDTO = await notion.getAllPagesFromNotionDatabase(
        notionDatabase.id,
        result.data.lastFetchedAt
      );

      notionDatabase.pages = pagesDTO;
      notionDatabase.size = pagesDTO.length;

      // Database に Page [] があり、 DB に保存してない場合
      if (isFirstTime) {
        databaseFinallyUpdateArg.id = notionDatabase.id;
        // 初期登録
        await prisma.database.create({
          data: {
            id: notionDatabase.id,
            name: notionDatabase.name,
            lastFetchedAt: notionDatabase.lastFetchedAt!,
            createdAt: notionDatabase.createdAt,
            lastEditedAt: notionDatabase.lastEditedAt,
            size: notionDatabase.size,
          },
        });
        if (notionDatabase.size) {
          for (const page of notionDatabase.pages) {
            if (page.lastEditedBy) {
              await prisma.page.create({
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
              await prisma.page.create({
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
      } else if (hadStoredDatabaseIncludeAllRelations !== null) {
        // database に紐づいたページを取得
        const hadStoredPages = hadStoredDatabaseIncludeAllRelations.pages;

        const userMap = new Map<string, User>();
        // 2回目以降なので差分を比較
        const pageCreateInputValues = notionDatabase.pages
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
              // userMap.set(lastEditedBy.id, {
              //   id: lastEditedBy.id,
              //   name: lastEditedBy.name!,
              //   avatarURL: lastEditedBy.avatarURL!,
              //   email: lastEditedBy?.email || null,
              // });
              const user = new UserRepository(lastEditedBy);
              userMap.set(lastEditedBy.id);
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
              const databaseName =
                hadStoredDatabaseIncludeAllRelations.name || "";
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
        await databaseRepo.update(databaseFinallyUpdateArg);
        await prisma.database.update({
          where: { id: databaseFinallyUpdateArg.id },
          data: {
            lastFetchedAt: databaseFinallyUpdateArg.lastFetchedAt,
            size: notionDatabase.size,
          },
        });
      }
      return databaseFinallyUpdateArg;
    })
  );
  console.log("main:end");
};

const job = new Scheduler(main);
job.setInterval({ seconds: 10 });
