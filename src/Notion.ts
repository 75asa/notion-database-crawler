import { Client } from "@notionhq/client/build/src";
import { DatabasesQueryResponse } from "@notionhq/client/build/src/api-endpoints";
import {
  LastEditedByPropertyValue,
  PropertyValue,
  RichText,
  TitlePropertyValue,
} from "@notionhq/client/build/src/api-types";
import { RequestParameters } from "@notionhq/client/build/src/Client";
import { Config } from "./Config";
import { DatabaseDTO, PageDTO } from "./types";
import { parseDate, parseISO8601 } from "./utils";
import { User } from "./valueObject/User";

export class Notion {
  private notion;
  constructor(authKey: string) {
    this.notion = new Client({ auth: authKey });
  }

  private getName(titleList: RichText[]) {
    return titleList.reduce((acc, cur) => {
      if (!("plain_text" in cur)) return acc;
      return (acc += (acc.length ? " " : "") + cur.plain_text);
    }, "");
  }

  private isTitlePropertyValue = (
    propValue: PropertyValue
  ): propValue is TitlePropertyValue => {
    // TODO: propValue.title === RichText[] も入れたい
    return (propValue as TitlePropertyValue).type === "title";
  };

  private isLastEditedByPropertyValue = (
    propValue: PropertyValue
  ): propValue is LastEditedByPropertyValue => {
    return (propValue as LastEditedByPropertyValue).type === "last_edited_by";
  };

  // integration が取得可能な database を取得
  async getAllDatabase(): Promise<DatabaseDTO[]> {
    const searched = await this.notion.search({
      filter: { value: "database", property: "object" },
    });
    return searched.results.map(data => {
      const name = data.object === "database" ? this.getName(data.title) : "";
      return {
        id: data.id,
        name,
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
            // property: "CreatedAt",
            property: Config.Notion.CREATED_AT_PROP_NAME,
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
        const propLastEditedBy =
          page.properties[Config.Notion.LAST_EDITED_BY_PROP_NAME];
        let name = this.isTitlePropertyValue(propName)
          ? this.getName(propName.title)
          : "";
        let lastEditedBy;
        // タイトル含むか

        if (this.isLastEditedByPropertyValue(propLastEditedBy)) {
          const user = User.create(propLastEditedBy.last_edited_by);
          lastEditedBy = user.instance;
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
