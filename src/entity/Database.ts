import { Entity } from "./Entity";
import {
  Database as NotionDatabase,
  RichText,
} from "@notionhq/client/build/src/api-types";
import { Database as DatabaseProps } from "@prisma/client";
import { parseDate } from "~/utils";

// TODO: unify
const getName = (titleList: RichText[]) => {
  return titleList.reduce((acc, cur) => {
    if (!("plain_text" in cur)) return acc;
    return (acc += (acc.length ? " " : "") + cur.plain_text);
  }, "");
};

export class Database extends Entity<DatabaseProps> {
  private constructor(databaseProps: DatabaseProps, id: string) {
    super(databaseProps, id);
  }
  static create(props: NotionDatabase): Database {
    const name = getName(props.title);
    return new Database(
      {
        id: props.id,
        name,
        createdAt: parseDate(props.created_time),
        lastEditedAt: parseDate(props.last_edited_time),
        lastFetchedAt: new Date(),
        size: 0,
      },
      props.id
    );
  }

  get props(): DatabaseProps {
    return this.props;
  }

  set setLastFetchedAt(lastFetchedAt: Date) {
    this.props.lastFetchedAt = lastFetchedAt;
  }

  set setLastEditedAt(lastEditedAt: Date) {
    this.props.lastEditedAt = lastEditedAt;
  }

  set size(size: number) {
    this.props.size = size;
  }

  set setName(name: string) {
    this.props.name = name;
  }
}
