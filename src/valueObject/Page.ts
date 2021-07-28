import {
  LastEditedByPropertyValue,
  Page as NotionPage,
  PropertyValue,
  RichText,
  TitlePropertyValue,
} from "@notionhq/client/build/src/api-types";
import { Page as PageEntity } from "@prisma/client";
import { Config } from "~/Config";
import { parseDate } from "~/utils";
import { User } from "./User";
import { ValueObject } from "./ValueObject";

export class Page extends ValueObject<NotionPage> {
  static create(props: NotionPage): Page {
    return new Page(props);
  }

  private getName(titleList: RichText[]) {
    return titleList.reduce((acc, cur) => {
      if (!("plain_text" in cur)) return acc;
      return (acc += (acc.length ? " " : "") + cur.plain_text);
    }, "");
  }

  private isTitlePropertyValue = (
    propValue: PropertyValue
  ): propValue is TitlePropertyValue => {
    // TODO: propValue.title === RichText[] も入れたい
    return (propValue as TitlePropertyValue).type === "title";
  };

  private isLastEditedByPropertyValue = (
    propValue: PropertyValue
  ): propValue is LastEditedByPropertyValue => {
    return (propValue as LastEditedByPropertyValue).type === "last_edited_by";
  };

  get entity(): PageEntity {
    const propName = this._value.properties?.Name;
    const propLastEditedBy =
      this._value.properties[Config.Notion.LAST_EDITED_BY_PROP_NAME];
    const name = this.isTitlePropertyValue(propName)
      ? this.getName(propName.title)
      : "";
    let lastEditedBy;
    if (this.isLastEditedByPropertyValue(propLastEditedBy)) {
      const user = User.create(propLastEditedBy.last_edited_by);
      lastEditedBy = user.entity;
    }
    return {
      id: this._value.id,
      databaseId:
        this._value.parent.type === "database_id"
          ? this._value.parent.database_id
          : "",
      name,
      createdAt: parseDate(this._value.created_time),
      url: this._value.url,
      userId: lastEditedBy ? lastEditedBy.id : "",
    };
  }
}
