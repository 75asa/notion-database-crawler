import { Database as NotionDatabase } from "@notionhq/client/build/src/api-types";
import { Database, Page, User } from "@prisma/client";
import { DatabaseRepository } from "~/repository/DatabaseRepository";

export class MainUseCase {
  private hadStoredDatabaseIncludeAllRelations = false;
  private storedDatabaseIncludeAllRelations: Database & {
    pages: (Page & {
      LastEditedBy: User;
    })[];
  };
  constructor(
    private notionDatabase: NotionDatabase,
    private databaseRepo: DatabaseRepository
  ) {
    this.init();
  }

  async init() {
    try {
      const result =
        await this.databaseRepo.findStoredDatabaseIncludeAllRelations(
          this.notionDatabase.id
        );
      if (result !== null) {
        this.storedDatabaseIncludeAllRelations = result;
        this.hadStoredDatabaseIncludeAllRelations = true;
      }
    } catch (err) {
      throw err;
    }
  }

  async invoke() {
    // DB保存済みの場合
    if (this.hadStoredDatabaseIncludeAllRelations) {
      // TODO: 型情報みる
      result.data.lastFetchedAt =
        hadStoredDatabaseIncludeAllRelations.lastFetchedAt;
      isFirstTime = false;
      result.data.id = hadStoredDatabaseIncludeAllRelations.id;
    }
  }
}
