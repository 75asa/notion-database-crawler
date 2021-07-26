import { Client } from "@notionhq/client/build/src";
import { DatabasesQueryResponse } from "@notionhq/client/build/src/api-endpoints";
import {
  Database,
  LastEditedByPropertyValue,
  Page,
  PropertyValue,
  RichText,
  TitlePropertyValue,
} from "@notionhq/client/build/src/api-types";
import { RequestParameters } from "@notionhq/client/build/src/Client";
import { Config } from "./Config";
import { DatabaseDTO, PageDTO } from "./types";
import { UserRepository } from "./repository/UserRepository";
import { parseDate, parseISO8601 } from "./utils";

export class Notion {
  private notion;
  constructor(authKey: string) {
    this.notion = new Client({ auth: authKey });
  }

  private getName(titleList: RichText[]) {
    return titleList.reduce((acc, cur) => {
      if (!("plain_text" in cur)) return acc;
      return (acc += ` ${cur.plain_text}`);
    }, "");
  }

  private isTitlePropertyValue = (
    propVal: PropertyValue
  ): propVal is TitlePropertyValue => {
    // TODO: propValue.title === RichText[] も入れたい
    return (propVal as TitlePropertyValue).type === "title";
  };

  private isLastEditedByPropertyValue = (
    propVal: PropertyValue
  ): propVal is LastEditedByPropertyValue => {
    return (propVal as LastEditedByPropertyValue).type === "last_edited_by";
  };

  // private isTitleInputPropertyValue = (
  //   propValue: PropertyValue
  // ): propValue is TitleInputPropertyValue => {
  //   return (
  //     (propValue as TitleInputPropertyValue).type === "title" &&
  //     // TODO: こうしたい
  //     (propValue as TitleInputPropertyValue).title === RichTextInput[]
  //   );
  // };

  // integration が取得可能な database を取得
  async getAllDatabase(): Promise<Database[]> {
    const searched = await this.notion.search({
      filter: { value: "database", property: "object" },
    });
    return searched.results.filter(
      (result): result is Exclude<typeof result, Page> => {
        return result.object === "database";
      }
    );
  }

  async getAllPagesFromNotionDatabase(databaseId: string, lastFetchedAt: Date) {
    let allPages: Page[] = [];

    const getPages = async (cursor?: string | null) => {
      const requestPayload: RequestParameters = {
        path: `databases/${databaseId}/query`,
        method: "post",
        body: {
          filter: {
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
        allPages.push(page);
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
