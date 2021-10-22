import {
  PropertyValue,
  RichTextPropertyValue,
} from "@notionhq/client/build/src/api-types";
import { isDetectiveType } from "../../../../utils";
import { PrimitiveValueObject } from "../../PrimitiveValueObject";
import { PeopleProperty } from "./PeopleProperty";

export class TextProperty extends PrimitiveValueObject<string> {
  static create(propValue: PropertyValue): TextProperty {
    if (!isDetectiveType<RichTextPropertyValue>(propValue)) {
      throw new Error(
        `Invalid TextPropertyValue: ${JSON.stringify(propValue)}`
      );
    }

    const richText = propValue.rich_text;
    const reducedText = richText.reduce((acc, cur) => {
      switch (cur.type) {
        case "equation": {
          const { plain_text, annotations, equation } = cur;
          acc += plain_text;
          return acc;
        }
        case "mention": {
          const { plain_text, annotations, mention } = cur;
          if (mention) {
            PeopleProperty.create(mention)
          }
          acc += `@${plain_text}`;
          return acc;
        }
        case "text": {
          const { plain_text, annotations } = cur;
          acc += plain_text;
          return acc;
        }
      }
    }, "");
    if (!reducedText) throw new Error("Invalid TextPropertyValue");
    return new TextProperty(reducedText);
  }
}
