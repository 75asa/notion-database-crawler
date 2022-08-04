import { User as UserProps } from ".prisma/client";
import {
  PropertyValue,
  PropertyValueCreatedBy,
} from "~/@types/notion-api-types";
import { Entity } from "~/model/entity/Entity";
import { isDetectiveType } from "~/utils";

export class User extends Entity<UserProps> {
  static create(props: PropertyValue): User {
    if (!isDetectiveType<PropertyValueCreatedBy>(props)) {
      throw new Error(
        `User.create: props must be a LastEditedByPropertyValue \n${JSON.stringify(
          props
        )}`
      );
    }
    const notionUser = props.created_by;
    if (!("type" in notionUser)) {
      // console.warn(
      //   `User.create: props.created_by must have a type\n Actual: ${JSON.stringify(
      //     props
      //   )}`
      // );
      return new User({
        id: notionUser.id,
        name: "",
        avatarUrl: "",
        email: "",
        updatedAt: new Date(),
      });
    }
    const { id, name, avatar_url, type } = notionUser;
    let email = null;
    if (type === "person") {
      const { person } = notionUser;
      if (person) email = person.email;
    }
    return new User({
      id,
      name: name || "",
      avatarUrl: avatar_url || "",
      email,
      updatedAt: new Date(),
    });
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this.props.name;
  }

  get avatarURL(): string {
    return this.props.avatarUrl;
  }
}
