import {
  PropertyValue,
  URLPropertyValue,
} from "@notionhq/client/build/src/api-types";
import { PrimitiveValueObject } from "../../PrimitiveValueObject";

const isURLPropertyValue = (
  propValue: PropertyValue
): propValue is URLPropertyValue => {
  return (propValue as URLPropertyValue).type === "url";
};

export class URL extends PrimitiveValueObject<string> {
  static create(propValue: PropertyValue): URL {
    if (!isURLPropertyValue(propValue)) {
      throw new Error(
        `Invalid URLProperty propValue: ${JSON.stringify(propValue)}`
      );
    }
    const { url } = propValue;
    if (!url) throw new Error("URLProperty propValue is missing url");
    return new URL(url);
  }
}
