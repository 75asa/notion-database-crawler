import {
  PropertyValue,
  PropertyValueNumber,
} from "../../../../@types/notion-api-types";
import { isDetectiveType } from "../../../../utils";
import { PrimitiveValueObject } from "../../PrimitiveValueObject";

export class NumberProperty extends PrimitiveValueObject<number> {
  static create(propValue: PropertyValue): NumberProperty {
    if (!isDetectiveType<PropertyValueNumber>(propValue)) {
      throw new Error(
        `Invalid NumberPropertyValue: ${JSON.stringify(propValue)}`
      );
    }
    const { number } = propValue;
    return new NumberProperty(number ?? 0);
  }
}
