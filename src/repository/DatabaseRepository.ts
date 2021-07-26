import { PrismaClient } from "@prisma/client";
import { DatabaseDTO } from "./types";

export interface DatabaseUpdateArg {
  id: string;
  lastFetchedAt: Date;
  size: number;
}

export class DatabaseRepository {
  constructor(private prisma = new PrismaClient()) {}

  async findStoredDatabaseIncludeAllRelations(databaseId: string) {
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
    });
  }

  async create(databaseDTO: DatabaseDTO) {
    return await this.prisma.database.create({
      data: {
        id: databaseDTO.id,
        name: databaseDTO.name,
        lastFetchedAt,
        firstIntegratedAt,
        createdAt: databaseDTO.createdAt,
        lastEditedAt: databaseDTO.lastEditedAt,
        size: databaseDTO.size,
      },
    });
  }

  // async update(id: string, lastFetchedAt: Date, size: number) {
  async update({ id, lastFetchedAt, size }: DatabaseUpdateArg) {
    return this.prisma.database.update({
      where: { id },
      data: { lastFetchedAt, size },
    });
  }
}
