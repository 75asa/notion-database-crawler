import { PostResult } from "~/@types/notion-api-types";
import { PrimitiveValueObject } from "~/model/valueObject/PrimitiveValueObject";

export class DatabaseId extends PrimitiveValueObject<string> {
  static create(props: PostResult): DatabaseId {
    const { parent } = props;
    if (parent.type !== "database_id") {
      throw new Error("DatabaseId.create: parent must be a database_id");
    }
    return new DatabaseId(parent.database_id);
  }
}
