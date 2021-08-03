import { AbstractValueObject } from "./AbstractValueObject";

interface ValueObjectProps {
  [index: string]: any;
}

export abstract class ValueObject<
  T extends ValueObjectProps
> extends AbstractValueObject<T> {}
