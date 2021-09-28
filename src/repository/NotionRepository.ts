import { Client } from "@notionhq/client/build/src";
import {
  BlocksChildrenListParameters,
  BlocksChildrenListResponse,
  DatabasesQueryResponse,
} from "@notionhq/client/build/src/api-endpoints";
import {
  Block,
  Page as NotionPage,
} from "@notionhq/client/build/src/api-types";
import { RequestParameters } from "@notionhq/client/build/src/Client";
import { Config } from "../Config";
import { Database } from "../model/entity/Database";
import { Page } from "../model/entity/Page";
import { User } from "../model/entity/User";
import { parseISO8601 } from "../utils";

const { Notion } = Config;
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
    const allPageAndUsers: { page: Page; user: User }[] = [];

    const getPages = async (cursor?: string) => {
      const requestPayload: RequestParameters = {
        path: `databases/${databaseId}/query`,
        method: "post",
        body: {
          filter: {
            property: Notion.CREATED_AT_PROP_NAME,
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
        if (e instanceof Error) throw e;
        if (!pages) throw new Error("pages is null");
      }

      for (const rawPage of pages.results) {
        if (rawPage.archived) continue;
        const page = Page.create(rawPage);
        const user = User.create(
          rawPage.properties[Notion.LAST_EDITED_BY_PROP_NAME]
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

  async getAllBlocksFromPage(pageId: string) {
    const allBlocks: Block[] = [];

    const getBlocks = async (cursor?: string) => {
      let blocks = null;
      const blocksChildrenListParameters: BlocksChildrenListParameters = {
        block_id: pageId,
      };
      if (cursor) blocksChildrenListParameters.start_cursor = cursor;
      try {
        blocks = (await this.notion.blocks.children.list(
          blocksChildrenListParameters
        )) as BlocksChildrenListResponse;
      } catch (e) {
        if (e instanceof Error) throw e;
        if (!blocks) throw new Error("blocks is null");
      }
      if (!blocks.results.length) return;
      allBlocks.push(...blocks.results);
      if (blocks.has_more) {
        await getBlocks(blocks.next_cursor ?? undefined);
      }
    };
    await getBlocks();

    return allBlocks;
  }
}
