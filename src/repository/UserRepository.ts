import { User } from ".prisma/client";
import { PrismaClient } from "@prisma/client";

export class UserRepository {
  private prisma;

  constructor(prismaClient: PrismaClient, user: User) {
    this.prisma = prismaClient;
  }
  async create(user: User) {
    this.prisma.user.create({ data: user });
  }

  async find(id: string) {
    this.prisma.user.findUnique({ where: { id } });
  }

  async upsert(user: User) {
    this.prisma.user.upsert({
      create: user,
      update: user,
      where: { id: user.id },
    });
  }
}
