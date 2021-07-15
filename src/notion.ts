import { Client } from "@notionhq/client/build/src";
import { DatabasesQueryResponse } from "@notionhq/client/build/src/api-endpoints";
import { RequestParameters } from "@notionhq/client/build/src/Client";
import { DatabaseDTO, PageDTO } from "./types";
import {
  isLastEditedByPropertyValue,
  isTitlePropertyValue,
  parseDate,
  parseISO8601,
} from "./utils";

export class Notion {
  private notion;
  constructor(authKey: string) {
    this.notion = new Client({ auth: authKey });
  }

  // integration が取得可能な database を取得
  async getAllDatabase(): Promise<DatabaseDTO[]> {
    const searched = await this.notion.search({
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
  }

  async getAllPagesFromNotionDatabase(databaseId: string, lastFetchedAt: Date) {
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
        pages = (await this.notion.request(
          requestPayload
        )) as DatabasesQueryResponse;
      } catch (e) {
        throw e;
      }

      for (const page of pages.results) {
        // TODO: 削除ページどうするか検討
        if (page.archived) continue;
        const propName = page.properties?.Name;
        const propLastEditedBy = page.properties?.LastEditedBy;
        let name = "";
        let lastEditedBy;
        // タイトル含むか
        // TODO: TitleRichPropertyValue も考慮
        if (isTitlePropertyValue(propName)) {
          name = propName.title.reduce((acc, cur) => {
            if (!("plain_text" in cur)) return acc;
            return (acc += ` ${cur.plain_text}`);
          }, "");
        }

        if (isLastEditedByPropertyValue(propLastEditedBy)) {
          const user = propLastEditedBy.last_edited_by;
          if (user.type === "person") {
            lastEditedBy = {
              id: user.id,
              name: user!.name,
              avatarURL: user!.avatar_url,
              email: user.person!.email,
            };
          }
        }

        allPages.push({
          id: page.id,
          databaseId,
          name,
          createdAt: parseDate(page.created_time),
          lastEditedBy,
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
  }
}
