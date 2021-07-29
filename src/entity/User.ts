import { User as NotionUser } from "@notionhq/client/build/src/api-types";
import { User as UserProps } from "@prisma/client";
import { Entity } from "./Entity";

export class User extends Entity<UserProps> {
  private constructor(props: UserProps, id: string) {
    super(props, id);
  }
  static create(props: NotionUser): User {
    const { id, name, avatar_url, type } = props;
    avatar_url = avatar_url || "";
    if (!name) throw new Error("User name is required");
    userArg.email = props.type === "person" ? props.person!.email : "";
    return new User(userArg, id);
  }
}
