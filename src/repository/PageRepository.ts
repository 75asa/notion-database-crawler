import { Page } from ".prisma/client";
import { PrismaClient, Prisma } from "@prisma/client";

export class PageRepository {
  private page;
  private prisma;

  constructor(prismaClient: PrismaClient, page: Page) {
    this.prisma = prismaClient;
    this.page = page;
  }
  async crate() {
    await this.prisma.page.create({ data: this.page });
  }

  async createMany(pageCreateManyInput: Prisma.PageCreateManyInput) {
    await this.prisma.page.createMany({
      data: pageCreateManyInput,
    });
  }
}
