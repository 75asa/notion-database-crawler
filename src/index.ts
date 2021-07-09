// Find the official Notion API client @ https://github.com/makenotion/notion-sdk-js/
// npm install @notionhq/client
import { Client } from "@notionhq/client";
import { DatabasesQueryResponse } from "@notionhq/client/build/src/api-endpoints";
import {
  PropertyValue,
  TitlePropertyValue,
} from "@notionhq/client/build/src/api-types";
import { RequestParameters } from "@notionhq/client/build/src/Client";
import { config } from "dotenv";
import dayjs from "dayjs";
import { Database, PrismaClient, Cluster } from "@prisma/client";

const prisma = new PrismaClient();

// NOTE: DTO ?
interface ClusterDTO {
  lastFetchedAt: string; // UTC ISO8601
  integratedAt: string;
  database: DatabaseDTO;
}

interface DatabaseDTO {
  notionId: string;
  createdAt: string;
  lastEditedAt: string;
  pages: PageDTO[];
  size: number;
}

interface PageDTO {
  notionId: string;
  createdAt: string;
  name?: string;
  url: string;
}

config();

const notion = new Client({ auth: process.env.NOTION_KEY });

// const findChangesAndNotify = async (storedDatabases: DatabaseDTO[]) => {
//   console.log("Looking for changes in Notion database 👻");
//   // Get the tasks currently in the database
//   const allDatabases = await getAllDatabase();
//   const currentDatabases = await Promise.all(
//     allDatabases.map(async database => {
//       return getAllPagesFromDatabase(database.notionId);
//     })
//   );
//   // console.dir(storedDatabases);
//   // console.dir(currentDatabases);
//   for (let storedDatabase of storedDatabases) {
//     for (let currentDatabase of currentDatabases) {
//       if (storedDatabase.databaseId !== currentDatabase.databaseId) continue;
//       for (let stored of storedDatabase.contents) {
//         for (let current of currentDatabase.contents) {
//           if (stored.id === current.id) continue;
//           // TODO: store
//           // console.log("new item added !!", { current });
//         }
//       }
//     }
//   }
//   // Run this method every 5 seconds (5000 milliseconds)
//   // setTimeout(main, 10000);
// };

const main = async () => {
  await prisma.$connect();
  // integration が取得可能な database (from Notion)
  const allDatabases = await getAllDatabase();
  // database に紐づいてる Page (from Notion)
  const contents = await Promise.all(
    allDatabases.map(async database => {
      // TODO: lastFetchedAt を取得
      const storedCluster = await prisma.cluster.findFirst({
        where: {
          database: {
            notionId: database.notionId,
          },
        },
      });
      // 前回同期した時間で Notion Page をフィルタ
      // -> 前回同期したものがない時は
      let lastFetchedAt = dayjs().format()
      // TODO: 初回同期した時間はどう使う？
      let firstIntegratedAt = dayjs().format()
      let isFirstTime = true;
      if (storedCluster) {
        // TODO: 型情報みる
        lastFetchedAt = storedCluster.lastFetchedAt.toISOString();
        firstIntegratedAt = storedCluster.firstIntegratedAt.toISOString();
        isFirstTime = false;
      }
      const pages = await getAllPagesFromDatabase(
        database.notionId,
        lastFetchedAt
      );

      // FIXME: database.pages が any になる
      database.pages = pages;
      database.size = pages.length;

      // DB に保存してない場合
      if (isFirstTime) {
        // 初期登録
        // TODO: 大量にある Page をどうするか検討
        const result = await prisma.cluster.create({
          data: {
            lastFetchedAt,
            firstIntegratedAt,
            database: {
              create: {
                notionId: database.notionId,
                createdAt: database.createdAt,
                lastEditedAt: database.lastEditedAt,
                size: database.size,
              }
            }
          }
        })
      }
      return database;
    })
  );
  // TODO: Mongo に保存？
  // NOTE: Mongo から取得した contents と current Notion Database を比較
  // findChangesAndNotify(contents).catch(console.error);
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

const getAllPagesFromDatabase = async (
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
            on_or_after: lastFetchedAt,
            // on_or_after: "2021-07-08T06:31:00.000Z", // NOTE: for test
          },
        },
      },
    };
    if (cursor) requestPayload.body = { start_cursor: cursor };
    // While there are more pages left in the query, get pages from the database.
    let pages = null;
    try {
      pages = (await notion.request(requestPayload)) as DatabasesQueryResponse;
      // pages as DatabasesQueryResponse;
    } catch (e) {
      console.error(e);
      throw e;
    }

    for (const page of pages.results) {
      if (page.archived) continue;
      const propName = page.properties.Name;
      let name = "";
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

main();
