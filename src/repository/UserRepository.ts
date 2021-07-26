import { User as NotionUser } from "@notionhq/client/build/src/api-types";
import { PrismaClient, User as PrismaUser } from "@prisma/client";

export class UserRepository {
  private _user: PrismaUser;
  constructor(private lastEditedBy: NotionUser) {
    if (lastEditedBy.type === "person") {
      this._user = {
        id: lastEditedBy.id,
        name: lastEditedBy.name || "",
        avatarURL: lastEditedBy.avatar_url || "",
        email: lastEditedBy.person!.email,
      };
    } else {
      this._user = {
        id: lastEditedBy.id,
        name: lastEditedBy.name || "",
        avatarURL: lastEditedBy.avatar_url || "",
        email: null,
      };
    }
  }
  get user() {
    return this._user;
  }
  storeUser() {
    const prisma = new PrismaClient();
    return prisma.user.create({ data: this._user });
  }
}
