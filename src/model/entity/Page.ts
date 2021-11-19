import { Page as PageProps } from "@prisma/client";
import {
  TitleProperty,
  DatabaseId,
  UserId,
} from "../../model/valueObject";
import { Config } from "../../Config";
import { parseDate } from "../../utils";
import { Entity } from "./Entity";
import { PostResult } from "../../@types/notion-api-types";
import { RawProperties } from "../valueObject/notion/rawProperties";

const { Props } = Config.Notion;
const { NAME, LAST_EDITED_BY } = Props;
export class Page extends Entity<PageProps> {
  static create(props: PostResult): Page {
    const { properties, id, created_time, url } = props;
    const name = TitleProperty.create(properties[NAME]).value;
    // TODO: properties から Slack に表示したい項目を環境変数から取得する
    const value = {
      id,
      name,
      createdAt: parseDate(created_time),
      url,
      rawProperties: RawProperties.create(properties).props,
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
