import { Database, Page, User } from ".prisma/client";
import { Database as NotionDatabase } from "@notionhq/client/build/src/api-types";
import { DatabaseRepository } from "~/repository/DatabaseRepository";
import { PageService } from "./PageService";

export class DatabaseService {
  private hadStoredDatabaseIncludeAllRelations = false;
  private database: Database;
  private storedDatabaseIncludeAllRelations: Database & {
    pages: (Page & {
      LastEditedBy: User;
    })[];
  };

  constructor(
    private notionDatabase: NotionDatabase,
    private databaseRepo: DatabaseRepository
  ) {}

  async init() {
    try {
      const result =
        await this.databaseRepo.findStoredDatabaseIncludeAllRelations(
          this.notionDatabase.id
        );
      if (result !== null) {
        const pageService = new PageService(result.pages);
        this.pages = result?.pages;
        this.storedDatabaseIncludeAllRelations = result;
        this.hadStoredDatabaseIncludeAllRelations = true;
      }
    } catch (e) {
      throw e;
    }
  }
}
