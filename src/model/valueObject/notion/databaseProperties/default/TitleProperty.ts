import { PropertyValue, PropertyValueTitle } from "~/@types/notion-api-types";
import { PrimitiveValueObject } from "~/model/valueObject/PrimitiveValueObject";
import { isDetectiveType, getName } from "~/utils";

export class TitleProperty extends PrimitiveValueObject<string> {
  static create(propValue: PropertyValue): TitleProperty {
    if (!isDetectiveType<PropertyValueTitle>(propValue)) {
      // throw new Error(
      //   `Invalid NameProperty propValue: ${console.dir(propValue)}`
      // );
    }
    return new TitleProperty(getName(propValue.title) || "Untitled");
  }
}
