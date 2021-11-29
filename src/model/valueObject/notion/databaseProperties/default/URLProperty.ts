import { PropertyValue, PropertyValueUrl } from "~/@types/notion-api-types";
import { PrimitiveValueObject } from "~/model/valueObject/PrimitiveValueObject";
import { isDetectiveType } from "~/utils";

export class URLProperty extends PrimitiveValueObject<string> {
  static create(propValue: PropertyValue): URLProperty {
    if (!isDetectiveType<PropertyValueUrl>(propValue)) {
      throw new Error(
        `Invalid URLProperty propValue: ${JSON.stringify(propValue)}`
      );
    }
    const { url } = propValue;
    if (!url) throw new Error("URLProperty propValue is missing url");
    return new URLProperty(url);
  }
}
