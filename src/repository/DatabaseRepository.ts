import { Database } from ".prisma/client";
import { PrismaClient } from "@prisma/client";

export class DatabaseRepository {
  private database;
  private prisma;

  constructor(prismaClient: PrismaClient, database: Database) {
    this.prisma = prismaClient;
    this.database = database;
  }
  async crate() {
    await this.prisma.database.create({ data: this.database });
  }

  async find(id: string) {
    await this.prisma.database.findFirst({
      where: { id },
      include: { pages: {} },
    });
  }

  async update(args: any) {
    await this.prisma.database.update({
      where: { id: this.database.id },
      data: args,
    });
  }
}
