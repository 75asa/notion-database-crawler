import { Client } from "@notionhq/client/build/src";
import {
  ListBlockChildrenParameters,
  QueryDatabaseResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { RequestParameters } from "@notionhq/client/build/src/Client";
import { PostResult, Block } from "~/@types/notion-api-types";
import { Config } from "~/Config";
import { NotionError } from "~/errors";
import { Database, Page, User } from "~/model/entity";

const { Props } = Config.Notion;

const MUST_EXIST_PROPS = Object.keys(Props).map(
  (key) => Props[key as keyof typeof Props] as keyof typeof Props
);

export class NotionRepository {
  #client;
  #pagesAndUsers: { page: Page; user: User }[] = [];
  constructor(authKey: string) {
    this.#client = new Client({ auth: authKey });
    this.#pagesAndUsers = [];
  }

  // integration が取得可能な database を取得
  async getAllDatabase() {
    let searched;
    try {
      searched = await this.#client.search({
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

  async #getPages(databaseId: string, cursor?: string) {
    const requestPayload: RequestParameters = {
      path: `databases/${databaseId}/query`,
      method: "post",
      body: {
        filter: {
          and: [
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
        // console.dir({ error }, { depth: null });
        if (error instanceof NotionError) {
          if (error.is502Error()) return;
        }
        if (error instanceof Error) throw error;
        if (!pages) throw new Error(`pages is null: ${error}`);
      }
      if (error instanceof Error) throw error;
      if (!pages) throw new Error(`pages is null: ${error}`);
    }

    await Promise.all(
      pages.results.map(async (rawPage) => {
        if (rawPage.archived) return;
        const page = Page.create(rawPage);
        const user = User.create(rawPage.properties[Props.CREATED_BY]);
        if (!page.name || !user.name) return;
        this.#pagesAndUsers.push({ page, user });
      })
    );

    if (!pages.has_more) return;

    await this.#getPages(databaseId, pages.next_cursor ?? undefined);
  }

  async getAllContentsFromDatabase(databaseId: string) {
    await this.#getPages(databaseId);
    return this.#pagesAndUsers;
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
        blocks = await this.#client.blocks.children.list(
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
