import { DatabaseRepository } from "~/repository/DatabaseRepository";
import { Database } from ".prisma/client";

export class DatabaseStore {
  constructor(private databaseRepo: DatabaseRepository) {}
  async invoke() {
    this.databaseRepo.crate();
  }
}
