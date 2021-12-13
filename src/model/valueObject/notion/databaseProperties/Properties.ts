import { Prisma } from "@prisma/client";
import { PropertyValueMap } from "~/@types/notion-api-types";
import { ValueObject } from "~/model/valueObject/ValueObject";
import { Config } from "~/Config";

const { VISIBLE_PROPS } = Config.Notion;

const isPrismaJsonObject = (input: unknown): input is Prisma.JsonObject => {
  return typeof input === "object" && input !== null && !Array.isArray(input);
};

export class Properties extends ValueObject<Prisma.JsonObject> {
  static create(propValues: PropertyValueMap): Properties {
    if (!isPrismaJsonObject(propValues)) throw new Error("Invalid propValues");
    const selectedJson: Prisma.JsonObject = {};
    for (const VISIBLE_PROP of VISIBLE_PROPS) {
      const value = propValues[VISIBLE_PROP];
      if (!value) continue;
      selectedJson[VISIBLE_PROP] = value;
    }
    return new Properties(selectedJson);
  }
}
