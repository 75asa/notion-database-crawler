// Find the official Notion API client @ https://github.com/makenotion/notion-sdk-js/
// npm install @notionhq/client
import { Client } from "@notionhq/client";
import { DatabasesQueryResponse } from "@notionhq/client/build/src/api-endpoints";
import { RequestParameters } from "@notionhq/client/build/src/Client";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { DatabaseDTO, PageDTO } from "./types";
import { AsyncTask, SimpleIntervalJob, ToadScheduler } from "toad-scheduler";
import { KnownBlock, WebClient } from "@slack/web-api";
import { sendMessage } from "./slack";
import { isTitlePropertyValue, parseDate, parseISO8601 } from "./utils";

const prisma = new PrismaClient();
const config = dotenv.config().parsed;

if (config) {
  for (const key in config) {
    process.env[key] = config[key];
  }
}

const notion = new Client({ auth: process.env.NOTION_KEY });

const main = async () => {
  console.log("main:start");
  await prisma.$connect();
  // integration が取得可能な database (from Notion)
  const allNotionDatabases = await getAllDatabase();
  // database に紐づいてる Page (from Notion)
  await Promise.all(
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
          pages: {},
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
      const pagesDTO = await getAllPagesFromNotionDatabase(
        databaseDTO.id,
        lastFetchedAt
      );

      databaseDTO.pages = pagesDTO;
      databaseDTO.size = pagesDTO.length;

      // Database に Page [] があり、 DB に保存してない場合
      if (isFirstTime) {
        // 初期登録
        // TODO: 大量にある Page をどうするか検討
        const databaseCreatedResult = await prisma.database.create({
          data: {
            id: databaseDTO.id,
            lastFetchedAt,
            firstIntegratedAt,
            createdAt: databaseDTO.createdAt,
            lastEditedAt: databaseDTO.lastEditedAt,
            size: databaseDTO.size,
          },
        });
        result.id = databaseCreatedResult.id;
        if (databaseDTO.size) {
          const pageCreateInputValues = databaseDTO.pages.map(page => {
            return {
              id: page.id,
              databaseId: databaseCreatedResult.id,
              createdAt: page.createdAt,
              url: page.url,
            };
          });
          try {
            await prisma.page.createMany({
              data: pageCreateInputValues,
            });
          } catch (e) {
            throw e;
          }
        }
      } else if (hadStoredDatabase !== null) {
        // database に紐づいたページを取得
        const hadStoredPages = hadStoredDatabase.pages;
        // 2回目以降なので差分を比較
        const pageCreateInputValues = databaseDTO.pages
          .map(page => {
            const hadStored = hadStoredPages.some(storedPage => {
              return storedPage.id === page.id;
            });
            if (hadStored) return;
            page.databaseId = hadStoredDatabase.id;
            return {
              id: page.id,
              databaseId: page.databaseId,
              createdAt: page.createdAt,
              url: page.url,
              name: page?.name || "",
            };
          })
          .filter(
            (item): item is Exclude<typeof item, undefined> =>
              item !== undefined
          );

        if (pageCreateInputValues.length) {
          try {
            await prisma.page.createMany({
              data: pageCreateInputValues,
            });
            const slackClient = new WebClient(process.env.SLACK_BOT_TOKEN!);
            // Slack 通知
            for (const value of pageCreateInputValues) {
              const msg = `新しいページが投稿されました ${value.url}`;
              const blocks: KnownBlock[] = [
                {
                  type: "section",
                  text: {
                    type: "mrkdwn",
                    text: msg,
                  },
                },
              ];
              sendMessage(msg, slackClient, blocks);
            }
          } catch (e) {
            throw e;
          }
        }
        // Database 更新
        await prisma.database.update({
          where: { id: result.id },
          data: { lastFetchedAt: result.lastFetchedAt },
        });
      }
      return result;
    })
  );
  console.log("main:end");
};

// integration が取得可能な database を取得
const getAllDatabase = async (): Promise<DatabaseDTO[]> => {
  const searched = await notion.search({
    filter: { value: "database", property: "object" },
  });
  return searched.results.map(data => {
    return {
      id: data.id,
      createdAt: parseDate(data.created_time),
      lastEditedAt: parseDate(data.last_edited_time),
      pages: [],
      size: 0,
    };
  });
};

const getAllPagesFromNotionDatabase = async (
  databaseId: string,
  lastFetchedAt: Date
) => {
  let allPages: PageDTO[] = [];

  const getPages = async (cursor?: string | null) => {
    const requestPayload: RequestParameters = {
      path: `databases/${databaseId}/query`,
      method: "post",
      body: {
        filter: {
          property: "createdAt",
          created_time: {
            // 前回同期した時間以降にフィルター
            on_or_after: parseISO8601(lastFetchedAt),
          },
        },
      },
    };
    if (cursor) requestPayload.body = { start_cursor: cursor };
    let pages = null;
    try {
      pages = (await notion.request(requestPayload)) as DatabasesQueryResponse;
    } catch (e) {
      throw e;
    }

    for (const page of pages.results) {
      // TODO: 削除ページどうするか検討
      if (page.archived) continue;
      const propName = page.properties.Name;
      let name = "";
      let lastEditedBy = 
      // タイトル含むか
      // TODO: TitleRichPropertyValue も考慮
      if (isTitlePropertyValue(propName)) {
        name = propName.title.reduce((acc, cur) => {
          if (!("plain_text" in cur)) return acc;
          return (acc += ` ${cur.plain_text}`);
        }, "");
      }

      allPages.push({
        id: page.id,
        name,
        createdAt: parseDate(page.created_time),
        lastEditedBy: page.
        url: page.url,
      });
    }
    if (pages.has_more) {
      const next_cursor = pages.next_cursor;
      await getPages(next_cursor);
    }
  };
  await getPages();
  return allPages;
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
const job = new SimpleIntervalJob({ minutes: 1 }, task);

scheduler.addSimpleIntervalJob(job);
