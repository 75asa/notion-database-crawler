// Find the official Notion API client @ https://github.com/makenotion/notion-sdk-js/
// npm install @notionhq/client
import { Client } from "@notionhq/client";
import { DatabasesQueryResponse } from "@notionhq/client/build/src/api-endpoints";
import {
  PropertyValue,
  TitlePropertyValue,
} from "@notionhq/client/build/src/api-types";
import { RequestParameters } from "@notionhq/client/build/src/Client";
import dotenv from "dotenv";
import dayjs from "dayjs";
import { PrismaClient } from "@prisma/client";
import { DatabaseDTO, PageDTO } from "./types";

const prisma = new PrismaClient();
const config = dotenv.config().parsed;

if (config) {
  for (const key in config) {
    process.env[key] = config[key];
  }
}

const notion = new Client({ auth: process.env.NOTION_KEY });

const main = async () => {
  await prisma.$connect();
  // integration が取得可能な database (from Notion)
  const allNotionDatabases = await getAllDatabase();
  // database に紐づいてる Page (from Notion)
  const contents = await Promise.all(
    allNotionDatabases.map(async databaseDTO => {
      const hadStoredDatabase = await prisma.database.findFirst({
        where: {
          notionId: databaseDTO.notionId,
        },
        include: {
          pages: {},
        },
      });
      // 前回同期した時間で Notion Page をフィルタ
      const now = dayjs().format();
      let lastFetchedAt = now;
      let firstIntegratedAt = now;
      let isFirstTime = true;

      // DB保存済みの場合
      if (hadStoredDatabase) {
        // TODO: 型情報みる
        lastFetchedAt = hadStoredDatabase.lastFetchedAt.toISOString();
        firstIntegratedAt = hadStoredDatabase.firstIntegratedAt.toISOString();
        isFirstTime = false;
      }
      const pagesDTO = await getAllPagesFromNotionDatabase(
        databaseDTO.notionId,
        lastFetchedAt
      );

      databaseDTO.pages = pagesDTO;
      databaseDTO.size = pagesDTO.length;

      // Database に Page [] があり、 DB に保存してない場合
      if (isFirstTime && databaseDTO.size) {
        // 初期登録
        // TODO: 大量にある Page をどうするか検討
        const databaseCreatedResult = await prisma.database.create({
          data: {
            lastFetchedAt,
            firstIntegratedAt,
            notionId: databaseDTO.notionId,
            createdAt: databaseDTO.createdAt,
            lastEditedAt: databaseDTO.lastEditedAt,
            size: databaseDTO.size,
          },
        });
        const pageCreateInputValues = databaseDTO.pages.map(page => {
          return {
            databaseId: databaseCreatedResult.id,
            notionId: page.notionId,
            createdAt: page.createdAt,
            url: page.url,
          };
        });
        try {
          await prisma.page.createMany({
            data: pageCreateInputValues,
          });
        } catch (e) {
          console.error({ e });
          throw e;
        }
      } else if (hadStoredDatabase !== null) {
        const hadStoredPage = await prisma.page.findMany({
          where: {
            databaseId: hadStoredDatabase.id,
          },
        });
        // 2回目以降なので差分を比較
        const unstoredPages = databaseDTO.pages.reduce((acc, cur) => {
          const hadStored = hadStoredPage.some(storedPage => {
            storedPage.notionId === cur.notionId;
          });
          // DB に未保存の Page だけ
          if (hadStored) return acc;
          cur!.databaseId = hadStoredDatabase.id;
          return acc;
        }, []);
        try {
          await prisma.page.createMany({ data: unstoredPages });
          // Slack 通知
        } catch (e) {
          console.error({ e });
          throw e;
        }
      }
      return databaseDTO;
    })
  );
};

// integration が取得可能な database を取得
const getAllDatabase = async (): Promise<DatabaseDTO[]> => {
  const searched = await notion.search({
    filter: { value: "database", property: "object" },
  });
  return searched.results.map(data => {
    return {
      notionId: data.id,
      createdAt: data.created_time,
      lastEditedAt: data.last_edited_time,
      pages: [],
      size: 0,
    };
  });
};

const getAllPagesFromNotionDatabase = async (
  databaseId: string,
  lastFetchedAt: string | Date
) => {
  let allPages: PageDTO[] = [];

  const getPages = async (cursor?: string | null) => {
    const requestPayload: RequestParameters = {
      path: `databases/${databaseId}/query`,
      method: "post",
      body: {
        // 前回同期した時間以降にフィルター、時間がない場合は現在時刻
        filter: {
          property: "createdAt",
          created_time: {
            // on_or_after: lastFetchedAt,
            on_or_after: "2021-07-08T06:31:00.000Z", // NOTE: for test
          },
        },
      },
    };
    if (cursor) requestPayload.body = { start_cursor: cursor };
    let pages = null;
    try {
      pages = (await notion.request(requestPayload)) as DatabasesQueryResponse;
    } catch (e) {
      console.error(e);
      throw e;
    }

    for (const page of pages.results) {
      // TODO: 削除ページどうするか検討
      if (page.archived) continue;
      const propName = page.properties.Name;
      let name = "";
      // タイトル含むか
      // TODO: TitleRichPropertyValue も考慮
      if (isTitlePropertyValue(propName)) {
        name = propName.title.reduce((acc, cur) => {
          if (!("plain_text" in cur)) return acc;
          return (acc += ` ${cur.plain_text}`);
        }, "");
      }

      allPages.push({
        name,
        notionId: page.id,
        createdAt: page.created_time,
        url: page.url,
      });
    }
    if (pages.has_more) {
      const next_cursor = pages.next_cursor;
      await getPages(next_cursor);
    }
  };
  await getPages();
  console.log({ allPages });
  return allPages;
};

export const isTitlePropertyValue = (
  propValue: PropertyValue
): propValue is TitlePropertyValue => {
  return (propValue as TitlePropertyValue).type === "title";
};

// TODO: cron で1分ごと繰り返し？
main();

// Run this method every 5 seconds (5000 milliseconds)
// setTimeout(main, 10000);
