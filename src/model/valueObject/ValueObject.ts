import { AbstractValueObject } from "./AbstractValueObject";

interface ValueObjectProps {
  [index: string]: unknown;
}

export abstract class ValueObject<
  T extends ValueObjectProps
> extends AbstractValueObject<T> {}
