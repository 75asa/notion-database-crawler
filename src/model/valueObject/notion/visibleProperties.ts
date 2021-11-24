import { Prisma } from ".prisma/client";
import {
  DateProperty,
  MultiSelectProperty,
  SelectProperty,
  VisiblePropsTypes,
} from ".";
import { PropertyValueMap } from "../../../@types/notion-api-types";
import { Config } from "../../../Config";
import { ValueObject } from "../ValueObject";

const { VISIBLE_PROPS } = Config.Notion;

export class VisibleProperties extends ValueObject<VisiblePropsTypes[]> {
  #props: VisiblePropsTypes[];
  static create(propValues: Prisma.JsonValue[]): VisibleProperties {
    if (
      !propValues ||
      typeof propValues !== "object" ||
      !Array.isArray(propValues)
    ) {
      throw new Error("propValues must be an object");
    }
    for (const propValue of propValues) {
      if (
        propValue === null ||
        typeof propValue !== "object" ||
        Array.isArray(propValue)
      ) {
        continue;
      }
    }
    const visibleProps = VISIBLE_PROPS.map((propName) => {
      const targetPropValue = propValues[propName];
      switch (targetPropValue.type) {
        case "select": {
          return SelectProperty.create(targetPropValue);
        }
        case "multi_select": {
          return MultiSelectProperty.create(targetPropValue);
        }
        case "date": {
          return DateProperty.create(targetPropValue);
        }
        default: {
          break;
        }
      }
    }).filter(
      (item): item is Exclude<typeof item, undefined> => item !== undefined
    );
    return new VisibleProperties(visibleProps);
  }
}
