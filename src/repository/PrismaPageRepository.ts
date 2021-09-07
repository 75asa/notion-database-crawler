import { PrismaClient } from '@prisma/client'
import { Page } from 'src/model/entity/Page'
import { User } from 'src/model/entity/User'

interface IPageRepository {
  create(page: Page, user: User): Promise<void>
}

export class PrismaPageRepository implements IPageRepository {
  constructor(private prisma: PrismaClient) {}

  async create(page: Page, user: User) {
    const { userId, databaseId, ...refinedPage } = page.allProps()
    try {
      await this.prisma.page.create({
        data: {
          ...refinedPage,
          Database: {
            connect: {
              id: databaseId,
            },
          },
          LastEditedBy: {
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
          LastEditedBy: true,
        },
      })
    } catch (e) {
      throw e
    }
  }
}
