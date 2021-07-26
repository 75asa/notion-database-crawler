import { Database as DatabaseInterface } from ".prisma/client";
import { Database as NotionDatabase } from "@notionhq/client/build/src/api-types";

export class Database implements DatabaseInterface {
  private id: string;
  private name: string;
  private createdAt: Date;
  private lastEditedAt: Date;
  private lastFetchedAt: Date;
  private size: number;
  private raw: NotionDatabase;
  constructor(private notionDatabase: NotionDatabase) {
    this.raw = notionDatabase;
  }
}
