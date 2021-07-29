import { User as NotionUser } from "@notionhq/client/build/src/api-types";
import { User as UserEntity } from "@prisma/client";
import { ValueObject } from "./ValueObject";

export class User extends ValueObject<NotionUser> {
  static create(props: NotionUser): User {
    if (!props.avatar_url) props.avatar_url = "";
    if (!props.name) throw new Error("User name is required");
    if (props.type === "person") {
      props.
    } else {
    }
    return new User(props);
  }

  get value() {
    return {
      id: this._value.id,
      name: this._value.name || "",
      avatarURL: this._value.avatar_url || "",
      email: this._value.type === "person" ? this._value.person!.email! : null,
    };
  }

  get entity(): UserEntity {
    return {
      id: this._value.id,
      name: this._value.name || "",
      avatarURL: this._value.avatar_url || "",
      email: this._value.type === "person" ? this._value.avatar_url! : null,
    };
  }
}
