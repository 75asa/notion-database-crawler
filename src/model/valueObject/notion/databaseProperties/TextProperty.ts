import {
  PropertyValue,
  RichTextPropertyValue,
} from "@notionhq/client/build/src/api-types";
import { UserBlock } from "..";
import { isDetectiveType } from "../../../../utils";
import { PrimitiveValueObject } from "../../PrimitiveValueObject";

export class TextProperty extends PrimitiveValueObject<string> {
  static create(propValue: PropertyValue): TextProperty {
    if (!isDetectiveType<RichTextPropertyValue>(propValue)) {
      throw new Error(
        `Invalid TextPropertyValue: ${JSON.stringify(propValue)}`
      );
    }

    const richText = propValue.rich_text;
    const reducedText = richText.reduce((acc, cur) => {
      const { plain_text, annotations, equation, href, type } = cur;
      switch (type) {
        case "equation": {
          acc += plain_text;
          return acc;
        }
        case "mention": {
          const { type } = cur.mention;
          switch (type) {
            case "database": {
              cur.mention.database.id;
              break;
            }
            case "user": {
              if (cur.mention.type === "user") {
                const user = UserBlock.create(cur.mention.user);
                user.props;
              }
              break;
            }
            case "date": {
              break;
            }
            case "page": {
              break;
            }
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
