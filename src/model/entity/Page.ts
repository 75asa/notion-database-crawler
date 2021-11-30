import { Page as PageProps, Prisma } from ".prisma/client";
import { PostResult } from "~/@types/notion-api-types";
import { Config } from "~/Config";
import { Entity } from "~/model/entity/Entity";
import {
  DatabaseId,
  UserId,
  Properties,
  TitleProperty,
} from "~/model/valueObject";
import { parseDate } from "~/utils";

const { NAME, LAST_EDITED_BY } = Config.Notion.Props;

interface CustomPageProps extends PageProps {
  properties: Prisma.JsonObject;
}
export class Page extends Entity<CustomPageProps> {
  static create(props: PostResult): Page {
    const { properties, id, created_time, url } = props;
    const name = TitleProperty.create(properties[NAME]).value;
    const value = {
      id,
      name,
      createdAt: parseDate(created_time),
      url,
      properties: Properties.create(properties).props,
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

  get properties() {
    return this.props.properties;
  }
}
