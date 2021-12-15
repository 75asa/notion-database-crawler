import { Page as PageProps, Prisma } from ".prisma/client";
import { PostResult } from "~/@types/notion-api-types";
import { Config } from "~/Config";
import { Entity } from "~/model/entity/Entity";
import {
  DatabaseId,
  UserId,
  Properties,
  TitleProperty,
  CheckboxProperty,
} from "~/model/valueObject";
import { parseDate } from "~/utils";

const { Props, IGNORE_KEYWORDS } = Config.Notion;
const { NAME, CREATED_BY, IS_PUBLISHED } = Props;

interface CustomPageProps extends PageProps {
  properties: Prisma.JsonObject;
}
export class Page extends Entity<CustomPageProps> {
  static create(props: PostResult): Page {
    const { properties, id, created_time, url } = props;
    const name = TitleProperty.create(properties[NAME]).value;
    const ignoreTitle = IGNORE_KEYWORDS.some((keyword) => name.match(keyword));
    const isPublished = CheckboxProperty.create(properties[IS_PUBLISHED]).value;
    const value = {
      id,
      name: ignoreTitle || !isPublished ? "" : name,
      pageCreatedAt: parseDate(created_time),
      url,
      properties: Properties.create(properties).props,
      databaseId: DatabaseId.create(props).value,
      userId: UserId.create(properties[CREATED_BY]).value,
      createdAt: new Date(),
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
