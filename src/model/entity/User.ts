import {
  CreatedByPropertyValue,
  PropertyValue,
} from "@notionhq/client/build/src/api-types";
import { User as UserProps } from "@prisma/client";
import { Entity } from "./Entity";

const isCreatedByPropertyValue = (
  propValue: PropertyValue
): propValue is CreatedByPropertyValue => {
  return (propValue as CreatedByPropertyValue).type === "created_by";
};

export class User extends Entity<UserProps> {
  static create(props: PropertyValue): User {
    if (!isCreatedByPropertyValue(props)) {
      throw new Error("User.create: props must be a LastEditedByPropertyValue");
    }
    const notionUser = props.created_by;
    const { id, name, avatar_url, type } = notionUser;
    let email = null;
    if (type === "person") {
      const { person } = notionUser;
      if (person) email = person.email;
    }
    const value = {
      id,
      name: name || "",
      avatarURL: avatar_url || "",
      email,
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
