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
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { PrismaClient } from "@prisma/client";
import { DatabaseDTO, PageDTO } from "./types";

dayjs.extend(timezone);
dayjs.extend(utc);

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
      const result: { id: string; lastFetchedAt: Date } = {
        id: "",
        lastFetchedAt: new Date(),
      };
      const hadStoredDatabase = await prisma.database.findFirst({
        where: {
          notionId: databaseDTO.notionId,
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
        databaseDTO.notionId,
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
            lastFetchedAt,
            firstIntegratedAt,
            notionId: databaseDTO.notionId,
            createdAt: databaseDTO.createdAt,
            lastEditedAt: databaseDTO.lastEditedAt,
            size: databaseDTO.size,
          },
        });
        result.id = databaseCreatedResult.id;
        if (databaseDTO.size) {
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
        }
      } else if (hadStoredDatabase !== null) {
        // database に紐づいたページを取得
        const hadStoredPages = hadStoredDatabase.pages;
        // 2回目以降なので差分を比較
        const pageCreateInputValues = databaseDTO.pages
          .map(page => {
            const hadStored = hadStoredPages.some(storedPage => {
              return storedPage.notionId === page.notionId;
            });
            if (hadStored) return;
            page.databaseId = hadStoredDatabase.id;
            return {
              databaseId: page.databaseId,
              notionId: page.notionId,
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
            // Slack 通知
            for (const value of pageCreateInputValues) {
              console.log(`新しいページは ${value.url}`);
            }
          } catch (e) {
            console.error({ e });
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
};

// integration が取得可能な database を取得
const getAllDatabase = async (): Promise<DatabaseDTO[]> => {
  const searched = await notion.search({
    filter: { value: "database", property: "object" },
  });
  return searched.results.map(data => {
    return {
      notionId: data.id,
      createdAt: dayjs(data.created_time).toDate(),
      lastEditedAt: dayjs(data.last_edited_time).toDate(),
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
        // 前回同期した時間以降にフィルター、時間がない場合は現在時刻
        filter: {
          property: "createdAt",
          created_time: {
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
        createdAt: parseDate(page.created_time),
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

export const parseDate = (isoString: string) => {
  return dayjs(isoString).toDate();
  // return dayjs(isoString).tz('Asia/Tokyo').toDate();
};

export const parseISO8601 = (date: Date) => {
  return dayjs(date).format();
};

// Run this method every 5 seconds (5000 milliseconds)
setTimeout(main, 10000);
