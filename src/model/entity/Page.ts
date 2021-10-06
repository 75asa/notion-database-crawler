import { Page as NotionPage } from "@notionhq/client/build/src/api-types";
import { Page as PageProps } from "@prisma/client";
import { NameProperty, DatabaseId, UserId } from "model/valueObject";
import { Config } from "../../Config";
import { parseDate } from "../../utils";
import { Entity } from "./Entity";

const { NAME, LAST_EDITED_BY } = Config.Notion.Props;

export class Page extends Entity<PageProps> {
  static create(props: NotionPage): Page {
    const { properties, id, created_time, url } = props;
    const name = NameProperty.create(properties[NAME]).value;
    const value = {
      id,
      databaseId: DatabaseId.create(props).value,
      name,
      createdAt: parseDate(created_time),
      url,
      userId: UserId.create(properties[LAST_EDITED_BY]).value,
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
