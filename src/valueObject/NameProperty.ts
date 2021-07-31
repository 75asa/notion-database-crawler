import {
  PropertyValue,
  RichText,
  TitlePropertyValue,
} from "@notionhq/client/build/src/api-types";
import { PrimitiveValueObject } from "./PrimitiveValueObject";

// TODO: unify
const getName = (titleList: RichText[]) => {
  return titleList.reduce((acc, cur) => {
    if (!("plain_text" in cur)) return acc;
    return (acc += (acc.length ? " " : "") + cur.plain_text);
  }, "");
};

const isTitlePropertyValue = (
  propValue: PropertyValue
): propValue is TitlePropertyValue => {
  // TODO: propValue.title === RichText[] も入れたい
  return (propValue as TitlePropertyValue).type === "title";
};

export class NameProperty extends PrimitiveValueObject<string> {
  static create(propValue: PropertyValue): NameProperty {
    if (!isTitlePropertyValue(propValue)) {
      throw new Error(
        `Invalid NameProperty propValue: ${console.dir(propValue)}`
      );
    }
    return new NameProperty(getName(propValue.title));
  }
}
