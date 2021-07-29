export abstract class AbstractPrismaRepository<T> {
  constructor() {}

  abstract find(): Promise<T[]>;
  abstract create(): Promise<T[]>;
  abstract update(): Promise<T[]>;
}
