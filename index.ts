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
import * as dayjs from "dayjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface Cluster {
  lastFetchedAt: string;
  integratedAt: string;
  database: Database;
}

interface Database {
  notionId: string;
  createdAt: string;
  lastEditedAt: string;
  pages: Page[];
  size: number;
}

interface Page {
  notionId: string;
  createdAt: string;
  name?: string;
  url: string;
}

config();

const notion = new Client({ auth: process.env.NOTION_KEY });

const findChangesAndNotify = async (storedDatabases: Database[]) => {
  console.log("Looking for changes in Notion database 👻");
  // Get the tasks currently in the database
  const allDatabases = await getAllDatabase();
  const currentDatabases = await Promise.all(
    allDatabases.map(async database => {
      return getAllPagesFromDatabase(database.notionId);
    })
  );
  // console.dir(storedDatabases);
  // console.dir(currentDatabases);
  for (let storedDatabase of storedDatabases) {
    for (let currentDatabase of currentDatabases) {
      if (storedDatabase.databaseId !== currentDatabase.databaseId) continue;
      for (let stored of storedDatabase.contents) {
        for (let current of currentDatabase.contents) {
          if (stored.id === current.id) continue;
          // TODO: store
          // console.log("new item added !!", { current });
        }
      }
    }
  }
  // Run this method every 5 seconds (5000 milliseconds)
  // setTimeout(main, 10000);
};

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
      const { lastFetchedAt, firstIntegratedAt } = storedCluster;
      console.log({ storedCluster });
      const pages = await getAllPagesFromDatabase(
        database.notionId,
        lastFetchedAt || new Date().toISOString()
      );

      // FIXME: database.pages が any になる
      database.pages = pages;
      database.size = pages.length;
      database.lastFetchedAt = lastFetchedAt;
      return database as Database;
    })
  );
  // TODO: Mongo に保存？
  // NOTE: Mongo から取得した contents と current Notion Database を比較
  findChangesAndNotify(contents).catch(console.error);
};

const getAllDatabase = async () => {
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
    } as Database;
  });
};

const getAllPagesFromDatabase = async (
  databaseId: string,
  lastFetchedAt?: string
) => {
  let allPages: Page[] = [];

  const getPages = async (cursor?: string | null) => {
    const requestPayload: RequestParameters = {
      path: `databases/${databaseId}/query`,
      method: "post",
      body: {
        // 前回同期した時間以降にフィルター、時間がない場合は現在時刻
        filter: {
          property: "created_time",
          on_or_after: lastFetchedAt,
        },
      },
    };
    if (cursor) requestPayload.body = { start_cursor: cursor };
    // While there are more pages left in the query, get pages from the database.
    const pages = (await notion.request(
      requestPayload
    )) as DatabasesQueryResponse;

    for (const page of pages.results) {
      if (page.archived) continue;
      const propName = page.properties.Name;
      let name = "";
      if (isTitlePropertyValue(propName)) {
        name = propName.title.reduce((acc, cur) => {
          console.log({ cur });
          if (!("plain_text" in cur)) return acc;
          return (acc += ` ${cur.plain_text}`);
        }, "");
      }
      // console.dir(name, { depth: null });

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
  // console.info({ databases });
  return allPages;
};

export const isTitlePropertyValue = (
  propValue: PropertyValue
): propValue is TitlePropertyValue => {
  return (propValue as TitlePropertyValue).type === "title";
};

main();
