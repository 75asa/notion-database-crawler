import { Entity } from "./Entity";
import { Database as NotionDatabase } from "@notionhq/client/build/src/api-types";
import { Database as DatabaseProps } from "@prisma/client";
import { parseDate } from "../../utils";
import { getName } from "../propertyHelpers";

export class Database extends Entity<DatabaseProps> {
  static create(props: NotionDatabase): Database {
    const name = getName(props.title);
    return new Database({
      id: props.id,
      name,
      createdAt: parseDate(props.created_time),
      lastEditedAt: parseDate(props.last_edited_time),
      lastFetchedAt: new Date(),
      size: 0,
    });
  }

  get id() {
    return this._id;
  }

  get name() {
    return this.props.name;
  }

  set lastFetchedAt(lastFetchedAt: Date) {
    this.lastFetchedAt = lastFetchedAt;
  }

  set size(size: number) {
    this.size = size;
  }
}
