import { Page as PageProps } from "@prisma/client";
import { PostResult } from "~/@types/notion-api-types";
import { Config } from "~/Config";
import { Entity } from "~/model/entity/Entity";
import { TitleProperty, DatabaseId, UserId } from "~/model/valueObject";
import { parseDate } from "~/utils";

const { NAME, LAST_EDITED_BY } = Config.Notion.Props;
export class Page extends Entity<PageProps> {
  static create(props: PostResult): Page {
    const { properties, id, created_time, url } = props;
    const name = TitleProperty.create(properties[NAME]).value;
    const value = {
      id,
      name,
      createdAt: parseDate(created_time),
      url,
      databaseId: DatabaseId.create(props).value,
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
