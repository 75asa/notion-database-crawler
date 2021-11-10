import {
  PropertyValue,
  PropertyValueSelect,
} from "../../../../@types/notion-api-types";
import { isDetectiveType } from "../../../../utils";
import { PrimitiveValueObject } from "../../PrimitiveValueObject";

export class SelectProperty extends PrimitiveValueObject<string | undefined> {
  static create(propValue: PropertyValue): SelectProperty {
    if (!isDetectiveType<PropertyValueSelect>(propValue)) {
      throw new Error(
        `Invalid SelectProperty propValue: ${JSON.stringify(propValue)}`
      );
    }
    const optionName = propValue.select?.name;
    return new SelectProperty(optionName);
  }
}
