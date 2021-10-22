import {
  PropertyValue,
  SelectPropertyValue,
} from "@notionhq/client/build/src/api-types";
import { isDetectiveType } from "../../../../utils";
import { PrimitiveValueObject } from "../../PrimitiveValueObject";

export class SelectProperty extends PrimitiveValueObject<string | undefined> {
  static create(propValue: PropertyValue): SelectProperty {
    if (!isDetectiveType<SelectPropertyValue>(propValue)) {
      throw new Error(
        `Invalid SelectProperty propValue: ${JSON.stringify(propValue)}`
      );
    }
    const optionName = propValue.select?.name;
    return new SelectProperty(optionName);
  }
}
