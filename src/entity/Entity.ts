const isEntity = (v: any): v is Entity<any> => {
  return v instanceof Entity;
};

export abstract class Entity<T> {
  protected readonly _id: string;
  private _props: T;

  protected get props(): T {
    return this._props;
  }

  protected set props(value: T) {
    this._props = value;
  }

  constructor(props: T, id: string) {
    this._id = id;
    this._props = props;
  }

  public equals(object?: Entity<T>): boolean {
    if (object == null || object == undefined) return false;

    if (this === object) return false;

    if (!isEntity(object)) return false;

    return this._id === object._id;
  }
}
