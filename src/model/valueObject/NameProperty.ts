import { PropertyValue, PropertyValueTitle } from "~/@types/notion-api-types";
import { PrimitiveValueObject } from "~/model/valueObject/PrimitiveValueObject";
import { getName } from "~/utils";

const isTitlePropertyValue = (
  propValue: PropertyValue
): propValue is PropertyValueTitle => {
  // TODO: propValue.title === RichText[] も入れたい
  return (propValue as PropertyValueTitle).type === "title";
};

export class NameProperty extends PrimitiveValueObject<string> {
  static create(propValue: PropertyValue): NameProperty {
    if (!isTitlePropertyValue(propValue)) {
      throw new Error(
        `Invalid NameProperty propValue: ${console.dir(propValue)}`
      );
    }
    return new NameProperty(getName(propValue.title) || "Untitled");
  }
}
