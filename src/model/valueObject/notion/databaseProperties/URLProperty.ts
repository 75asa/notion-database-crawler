import {
  PropertyValue,
  URLPropertyValue,
} from "@notionhq/client/build/src/api-types";
import { isDetectiveType } from "../../../../utils";
import { PrimitiveValueObject } from "../../PrimitiveValueObject";

export class URLProperty extends PrimitiveValueObject<string> {
  static create(propValue: PropertyValue): URLProperty {
    if (!isDetectiveType<URLPropertyValue>(propValue)) {
      throw new Error(
        `Invalid URLProperty propValue: ${JSON.stringify(propValue)}`
      );
    }
    const { url } = propValue;
    if (!url) throw new Error("URLProperty propValue is missing url");
    return new URLProperty(url);
  }
}
