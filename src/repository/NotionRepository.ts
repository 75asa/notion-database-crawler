import { Client } from "@notionhq/client/build/src";
import {
  ListBlockChildrenParameters,
  QueryDatabaseResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { RequestParameters } from "@notionhq/client/build/src/Client";
import { Block, PostResult } from "../@types/notion-api-types";
import { Config } from "../Config";
import { NotionError } from "../errors";
import { Database } from "../model/entity/Database";
import { Page } from "../model/entity/Page";
import { User } from "../model/entity/User";

const { Props, IGNORE_PREFIX, MUST_EXIST_PROPS } = Config.Notion;
export class NotionRepository {
  #notion;
  constructor(authKey: string) {
    this.#notion = new Client({ auth: authKey });
  }

  // integration が取得可能な database を取得
  async getAllDatabase() {
    let searched;
    try {
      searched = await this.#notion.search({
        filter: { value: "database", property: "object" },
      });
    } catch (e) {
      if (e instanceof Error) throw e;
      if (!searched) throw new Error("searched is null");
    }

    return searched.results
      .filter(
        (data): data is Exclude<typeof data, PostResult> =>
          data.object === "database"
      )
      .filter((database) => {
        return MUST_EXIST_PROPS.every((MUST_EXIST_PROP) => {
          return Object.keys(database.properties).includes(MUST_EXIST_PROP);
        });
      })
      .map((database) => {
        return Database.create(database);
      });
  }

  async getAllContentsFromDatabase(databaseId: string) {
    const allPageAndUsers: { page: Page; user: User }[] = [];

    const getPages = async (cursor?: string) => {
      const requestPayload: RequestParameters = {
        path: `databases/${databaseId}/query`,
        method: "post",
        body: {
          filter: {
            and: [
              {
                property: Props.NAME,
                text: {
                  does_not_contain: IGNORE_PREFIX,
                },
              },
              {
                property: Props.IS_PUBLISHED,
                checkbox: {
                  equals: true,
                },
              },
            ],
          },
        },
      };
      if (cursor) requestPayload.body = { start_cursor: cursor };
      let pages = null;
      try {
        pages = (await this.#notion.request(
          requestPayload
        )) as QueryDatabaseResponse;
      } catch (error) {
        console.dir({ error }, { depth: null });
        if (error instanceof NotionError) {
          if (error.is502Error()) return;
        }
        if (error instanceof Error) throw error;
        if (!pages) throw new Error(`pages is null: ${error}`);
      }

      for (const rawPage of pages.results) {
        if (rawPage.archived) continue;
        const page = Page.create(rawPage);
        const user = User.create(rawPage.properties[Props.LAST_EDITED_BY]);
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
      const blocksChildrenListParameters: ListBlockChildrenParameters = {
        block_id: pageId,
      };
      if (cursor) blocksChildrenListParameters.start_cursor = cursor;
      try {
        blocks = await this.#notion.blocks.children.list(
          blocksChildrenListParameters
        );
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
