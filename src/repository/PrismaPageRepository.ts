import { PrismaClient } from ".prisma/client";
import { Page, User } from "~/model/entity";

interface IPageRepository {
  create(page: Page, user: User): Promise<void>;
}

export class PrismaPageRepository implements IPageRepository {
  constructor(private prisma: PrismaClient) {}

  async create(page: Page, user: User) {
    const { userId, databaseId, ...refinedPage } = page.allProps();
    try {
      await this.prisma.page.create({
        data: {
          ...refinedPage,
          Database: {
            connect: {
              id: databaseId,
            },
          },
          CreatedBy: {
            connectOrCreate: {
              where: {
                id: userId,
              },
              create: user.allProps(),
            },
          },
        },
        include: {
          Database: true,
          CreatedBy: true,
        },
      });
    } catch (e) {
      if (e instanceof Error) throw e;
    }
  }
}
