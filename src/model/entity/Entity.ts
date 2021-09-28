const isEntity = (v: unknown): v is Entity<any> => {
  return v instanceof Entity;
};

interface IDIncludeObject {
  id: string;
}

export abstract class Entity<T extends IDIncludeObject> {
  protected readonly _id: string;
  protected readonly props: T;

  constructor(props: T) {
    this._id = props.id;
    this.props = props;
  }

  public equals(object?: Entity<T>): boolean {
    if (object == null || object == undefined) return false;

    if (this === object) return false;

    if (!isEntity(object)) return false;

    return this._id === object._id;
  }

  public allProps(): T {
    return { ...this.props };
  }
}
