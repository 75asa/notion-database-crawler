import { Entity } from "./Entity";
import {
  Database as NotionDatabase,
  RichText,
} from "@notionhq/client/build/src/api-types";
import { Database as DatabaseProps } from "@prisma/client";
import { parseDate } from "../utils";

// TODO: unify
const getName = (titleList: RichText[]) => {
  return titleList.reduce((acc, cur) => {
    if (!("plain_text" in cur)) return acc;
    return (acc += (acc.length ? " " : "") + cur.plain_text);
  }, "");
};

export class Database extends Entity<DatabaseProps> {
  private _name: string;
  private _lastFetchedAt: Date;
  private _createdAt: Date;
  private _lastEditedAt: Date;
  private _size: number;
  private constructor(databaseProps: DatabaseProps, id: string) {
    super(databaseProps, id);
    this._name = this.name;
    this._lastFetchedAt = this.lastFetchedAt;
    this._lastEditedAt = this.lastEditedAt;
    this._size = this.size;
    this._createdAt = this.createdAt;
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
    return {
      id: this.id,
      name: this.name,
      lastFetchedAt: this.lastFetchedAt,
      lastEditedAt: this.lastEditedAt,
      createdAt: this.createdAt,
      size: this.size,
    };
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  set name(name: string) {
    this._name = name;
  }

  get lastFetchedAt() {
    return this._lastFetchedAt;
  }

  set lastFetchedAt(lastFetchedAt: Date) {
    this._lastFetchedAt = lastFetchedAt;
  }

  get lastEditedAt() {
    return this._lastEditedAt;
  }

  set lastEditedAt(lastEditedAt: Date) {
    this._lastEditedAt = lastEditedAt;
  }

  get size() {
    return this._size;
  }

  set size(size: number) {
    this._size = size;
  }

  get createdAt(): Date {
    return this._createdAt;
  }
}
