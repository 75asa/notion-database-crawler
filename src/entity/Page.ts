import { Page as NotionPage } from "@notionhq/client/build/src/api-types";
import { Page as PageProps } from "@prisma/client";
import { Config } from "../Config";
import { parseDate } from "../utils";
import { DatabaseId } from "../valueObject/DatabaseId";
import { NameProperty } from "../valueObject/NameProperty";
import { UserId } from "../valueObject/UserId";
import { Entity } from "./Entity";

export class Page extends Entity<PageProps> {
  static create(props: NotionPage): Page {
    const name = NameProperty.create(props.properties.Name).value;
    const propLastEditedBy =
      props.properties[Config.Notion.LAST_EDITED_BY_PROP_NAME];
    const value = {
      id: props.id,
      databaseId: DatabaseId.create(props).value,
      name,
      createdAt: parseDate(props.created_time),
      url: props.url,
      userId: UserId.create(propLastEditedBy).value,
    };
    return new Page(value, value.id);
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this.props.name;
  }

  get url(): string {
    return this.props.url;
  }

  get databaseId(): DatabaseId {
    return this.databaseId;
  }

  get createdAt(): Date {
    return this.createdAt;
  }

  get userId(): UserId {
    return this.userId;
  }

  get props(): PageProps {
    return {
      id: this.id,
      databaseId: this.databaseId.value,
      name: this.name,
      createdAt: this.createdAt,
      url: this.url,
      userId: this.userId.value,
    };
  }
}
