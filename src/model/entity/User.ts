import {
  LastEditedByPropertyValue,
  PropertyValue,
} from "@notionhq/client/build/src/api-types";
import { User as UserProps } from "@prisma/client";
import { Entity } from "./Entity";

const isLastEditedByPropertyValue = (
  propValue: PropertyValue
): propValue is LastEditedByPropertyValue => {
  return (propValue as LastEditedByPropertyValue).type === "last_edited_by";
};

export class User extends Entity<UserProps> {
  static create(props: PropertyValue): User {
    if (!isLastEditedByPropertyValue(props)) {
      throw new Error("User.create: props must be a LastEditedByPropertyValue");
    }
    const notionUser = props.last_edited_by;
    const value = {
      id: notionUser.id,
      name: notionUser.name || "",
      avatarURL: notionUser.avatar_url || "",
      email: notionUser.type === "person" ? notionUser.person!.email! : null,
    };
    return new User(value);
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this.props.name;
  }

  get avatarURL(): string {
    return this.props.avatarURL;
  }
}
