import { Prisma, Property as PropertyType } from ".prisma/client";
import { PostResult } from "~/@types/notion-api-types";
import { Entity } from "~/model/entity/Entity";
import { Properties } from "~/model/valueObject";

export class Property extends Entity<PropertyType> {
  static create(props: PostResult): Page {
    const value = {
      name,
      content: Properties.create(properties).props,
      createdAt: new Date(),
    };
    return new Property(value);
  }

  get id() {
    return this._id;
  }

  get name() {
    return this.props.name;
  }

  get url() {
    return this.props.url;
  }

  get properties() {
    return this.props.properties;
  }
}
