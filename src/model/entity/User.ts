import { User as UserProps } from "@prisma/client";
import {
  PropertyValue,
  PropertyValueEditedBy,
} from "../../@types/notion-api-types";
import { Entity } from "./Entity";
import { isDetectiveType } from "../../utils";

export class User extends Entity<UserProps> {
  static create(props: PropertyValue): User {
    if (!isDetectiveType<PropertyValueEditedBy>(props)) {
      throw new Error(
        `User.create: props must be a LastEditedByPropertyValue \n${JSON.stringify(
          props
        )}`
      );
    }
    const notionUser = props.last_edited_by;
    if (!("type" in notionUser))
      throw new Error(
        `User.create: props.last_edited_by must have a type\n Actual: ${props.last_edited_by}`
      );
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
