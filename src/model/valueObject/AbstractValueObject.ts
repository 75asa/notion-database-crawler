import { shallowEqual } from 'shallow-equal-object'

export abstract class AbstractValueObject<T> {
  protected readonly _value: T

  protected constructor(_value: T) {
    this._value = Object.freeze(_value)
  }

  equals(vo?: AbstractValueObject<T>): boolean {
    if (vo == null) return false
    return shallowEqual(this._value, vo._value)
  }
}
