import { PropertyValue } from "../../@types/notion-api-types";
import { User } from "../entity/User";
import { PrimitiveValueObject } from "./PrimitiveValueObject";

export class UserId extends PrimitiveValueObject<string> {
  static create(props: PropertyValue) {
    const user = User.create(props);
    return new UserId(user.id);
  }
}
