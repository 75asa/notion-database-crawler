import { Prisma, User } from "@prisma/client";
import { UserRepository } from "~/repository/UserRepository";

export class UserService {
  constructor(private user: User, private userRepo: UserRepository) {}

  create() {
    this.userRepo.create(this.user);
  }

  find(id: string) {
    this.userRepo.find(id);
  }

  upsert(
    id: string,
    userContents: (Prisma.XOR<
      Prisma.UserCreateInput,
      Prisma.UserUncheckedCreateInput
    > || Prisma.XOR<Prisma.UserUpdateInput, Prisma.PageUncheckedUpdateInput>)
  ) {
    const user = {
      id: arg.id,
    };
    this.userRepo.upsert();
  }
}
