import {
  PrismaClient,
  Database as PrismaDatabase,
  Page as PrismaPage,
  User as PrismaUser,
} from '@prisma/client'
import { Database } from 'src/model/entity/Database'

interface IDatabaseRepository {
  find(databaseId: string): Promise<
    | (PrismaDatabase & {
        pages: (PrismaPage & {
          LastEditedBy: PrismaUser
        })[]
      })
    | null
  >
  create(database: Database): Promise<void>
  update(database: Database): Promise<void>
}

export class PrismaDatabaseRepository implements IDatabaseRepository {
  constructor(private prisma: PrismaClient) {}

  async find(databaseId: string) {
    try {
      return await this.prisma.database.findFirst({
        where: {
          id: databaseId,
        },
        include: {
          pages: {
            include: {
              LastEditedBy: true,
            },
          },
        },
      })
    } catch (e) {
      throw e
    }
  }

  async create(database: Database) {
    try {
      await this.prisma.database.create({
        data: { ...database.allProps() },
      })
    } catch (e) {
      throw e
    }
  }

  async update(database: Database) {
    try {
      await this.prisma.database.update({
        where: { id: database.id },
        data: database.allProps(),
      })
    } catch (e) {
      throw e
    }
  }
}
