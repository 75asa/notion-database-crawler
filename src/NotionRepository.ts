import { Client } from "@notionhq/client/build/src";
import { DatabasesQueryResponse } from "@notionhq/client/build/src/api-endpoints";
import { Page as NotionPage } from "@notionhq/client/build/src/api-types";
import { RequestParameters } from "@notionhq/client/build/src/Client";
import { Config } from "./Config";
import { Database, Page, User } from "./entity";
import { parseISO8601 } from "./utils";

export class NotionRepository {
  private notion;
  constructor(authKey: string) {
    this.notion = new Client({ auth: authKey });
  }

  // integration が取得可能な database を取得
  async getAllDatabase() {
    const searched = await this.notion.search({
      filter: { value: "database", property: "object" },
    });
    return searched.results
      .filter(
        (data): data is Exclude<typeof data, NotionPage> =>
          data.object === "database"
      )
      .map((database) => {
        return Database.create(database);
      });
  }

  async getAllContentsFromDatabase(databaseId: string, lastFetchedAt: Date) {
    let allPageAndUsers: { page: Page; user: User }[] = [];

    const getPages = async (cursor?: string) => {
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

      for (const rawPage of pages.results) {
        // TODO: 削除ページどうするか検討
        if (rawPage.archived) continue;
        const page = Page.create(rawPage);
        const user = User.create(
          rawPage.properties[Config.Notion.LAST_EDITED_BY_PROP_NAME]
        );
        allPageAndUsers.push({ page, user });
      }
      if (pages.has_more) {
        await getPages(pages.next_cursor ?? undefined);
      }
    };
    await getPages();
    return allPageAndUsers;
  }
}
