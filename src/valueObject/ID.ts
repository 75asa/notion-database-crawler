import { PrimitiveValueObject } from "./PrimitiveValueObject";

export class ID extends PrimitiveValueObject<string> {
  static create(value: string): ID {
    if (value.length !== 32) {
      throw new Error("Invalid ID length");
    }
    return new ID(value);
  }
}
