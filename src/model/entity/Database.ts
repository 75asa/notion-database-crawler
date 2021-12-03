import { Database as DatabaseProps } from ".prisma/client";
import { SearchResult } from "~/@types/notion-api-types";
import { Entity } from "~/model/entity/Entity";
import { getName, parseDate } from "~/utils";

export class Database extends Entity<DatabaseProps> {
  static create(props: SearchResult): Database {
    if (props.object !== "database") throw new Error("Invalid object type");
    const { id, title, created_time, last_edited_time, url, icon, cover } =
      props;
    const name = getName(title);
    return new Database({
      id,
      name,
      database_created_at: parseDate(created_time),
      last_edited_at: parseDate(last_edited_time),
      url,
      size: 0,
      created_at: null,
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

  get url() {
    return this.props.url;
  }
}
