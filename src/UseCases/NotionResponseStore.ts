import { Database as NotionDatabase } from "@notionhq/client/build/src/api-types";
import { PrismaClient } from "@prisma/client";

export class NotionResponseStore {
  constructor(
    private prisma: PrismaClient,
    private notionDatabase: NotionDatabase
  ) {}

  async invoke() {
    await this.prisma.database.create({
      data: {
        id: this.notionDatabase.id,
        name: this.notionDatabase.name,
        lastFetchedAt: this.notionDatabase.lastFetchedAt!,
        createdAt: this.notionDatabase.createdAt,
        lastEditedAt: this.notionDatabase.lastEditedAt,
        size: this.notionDatabase.size,
      },
    });
  }
}
