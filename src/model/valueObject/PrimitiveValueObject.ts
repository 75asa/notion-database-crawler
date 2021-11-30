import { ValueObject } from "~/model/valueObject/ValueObject";

export abstract class PrimitiveValueObject<T> extends ValueObject<T> {
  get value(): T {
    return this.props;
  }
}
