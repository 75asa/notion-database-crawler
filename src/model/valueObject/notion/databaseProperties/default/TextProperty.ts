import {
  PropertyValue,
  PropertyValueRichText,
} from "~/@types/notion-api-types";
import { UserBlock } from "~/model/valueObject/notion/databaseProperties/subset";
import { PrimitiveValueObject } from "~/model/valueObject/PrimitiveValueObject";
import { isDetectiveType, extractUserOrBotFromPeoples } from "~/utils";

export class TextProperty extends PrimitiveValueObject<string> {
  static create(propValue: PropertyValue): TextProperty {
    if (!isDetectiveType<PropertyValueRichText>(propValue)) {
      throw new Error(
        `Invalid TextPropertyValue: ${JSON.stringify(propValue)}`
      );
    }

    const richText = propValue.rich_text;
    const reducedText = richText.reduce((acc, cur) => {
      const { plain_text, annotations, href, type } = cur;
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
                const peoples = extractUserOrBotFromPeoples([cur.mention.user]);
                const user = UserBlock.create(peoples[0]);
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
