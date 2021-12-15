import {
  PropertyValue,
  PropertyValueCheckbox,
} from "~/@types/notion-api-types";
import { PrimitiveValueObject } from "~/model/valueObject/PrimitiveValueObject";
import { isDetectiveType } from "~/utils";

export class CheckboxProperty extends PrimitiveValueObject<boolean> {
  static create(propValue: PropertyValue): CheckboxProperty {
    if (!isDetectiveType<PropertyValueCheckbox>(propValue)) {
      throw new Error(
        `Invalid CheckboxProperty propValue: ${console.dir(propValue)}`
      );
    }
    return new CheckboxProperty(propValue.checkbox);
  }
}
