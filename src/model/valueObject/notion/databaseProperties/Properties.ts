import { Prisma } from "@prisma/client";
import { PropertyValueMap } from "~/@types/notion-api-types";
import { ValueObject } from "~/model/valueObject/ValueObject";

const isPrismaJsonObject = (input: unknown): input is Prisma.JsonObject => {
  return typeof input === "object" && input !== null && !Array.isArray(input);
};

export class Properties extends ValueObject<Prisma.JsonObject> {
  static create(propValues: PropertyValueMap): Properties {
    if (!isPrismaJsonObject(propValues)) throw new Error("Invalid propValues");
    return new Properties(propValues);
  }
}
