import { ValueObject } from "./ValueObject";

export abstract class PrimitiveValueObject<T> extends ValueObject<T> {
  get value(): T {
    return this.props;
  }
}
