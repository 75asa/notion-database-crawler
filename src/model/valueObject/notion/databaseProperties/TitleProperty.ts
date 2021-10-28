import {
  PropertyValue,
  TitlePropertyValue,
} from "@notionhq/client/build/src/api-types";
import { getName, isDetectiveType } from "../../../../utils";
import { PrimitiveValueObject } from "../../PrimitiveValueObject";

export class TitleProperty extends PrimitiveValueObject<string> {
  static create(propValue: PropertyValue): TitleProperty {
    if (!isDetectiveType<TitlePropertyValue>(propValue)) {
      throw new Error(
        `Invalid NameProperty propValue: ${console.dir(propValue)}`
      );
    }
    return new TitleProperty(getName(propValue.title) || "Untitled");
  }
}
