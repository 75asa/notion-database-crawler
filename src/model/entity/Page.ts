import { Page as NotionPage } from "@notionhq/client/build/src/api-types";
import { Page as PageProps } from "@prisma/client";
import { Config } from "../../Config";
import { parseDate } from "../../utils";
import { DatabaseId } from "../valueObject/DatabaseId";
import { NameProperty } from "../valueObject/NameProperty";
import { UserId } from "../valueObject/UserId";
import { Entity } from "./Entity";

export class Page extends Entity<PageProps> {
  static create(props: NotionPage): Page {
    const name = NameProperty.create(props.properties.Name).value;
    const propLastEditedBy =
      props.properties[Config.Notion.Props.LAST_EDITED_BY];
    const value = {
      id: props.id,
      databaseId: DatabaseId.create(props).value,
      name,
      createdAt: parseDate(props.created_time),
      url: props.url,
      userId: UserId.create(propLastEditedBy).value,
    };
    return new Page(value);
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
}
