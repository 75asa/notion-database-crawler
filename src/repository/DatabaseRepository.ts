import { Database, prisma, PrismaClient } from "@prisma/client";
import { AbstractPrismaRepository } from "./AbstractPrismaRepository";

export class DatabaseRepository extends AbstractPrismaRepository<Database> {
  private database: Database;
  private prisma: PrismaClient;
  constructor({ database }) {
    super();
    this.database = database;
    this.prisma = new PrismaClient();
  }

  find() {
    this.prisma.database.findOne({ id: this.database.id });
  }

  create(database: Database): Promise<Database> {}
}
