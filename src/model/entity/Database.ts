import { Entity } from "./Entity";
import { Database as NotionDatabase } from "@notionhq/client/build/src/api-types";
import { Database as DatabaseProps } from "@prisma/client";
import { getName, parseDate } from "../../utils";

export class Database extends Entity<DatabaseProps> {
  static create(props: NotionDatabase): Database {
    const { id, title, created_time, last_edited_time } = props;
    const name = getName(title);
    return new Database({
      id,
      name,
      createdAt: parseDate(created_time),
      lastEditedAt: parseDate(last_edited_time),
      size: 0,
    });
  }

  get id() {
    return this._id;
  }

  get name() {
    return this.props.name;
  }

  get size() {
    return this.props.size;
  }

  set size(size: number) {
    this.props.size = size;
  }
}
