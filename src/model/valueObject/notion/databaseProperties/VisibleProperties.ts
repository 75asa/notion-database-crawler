import { Prisma } from ".prisma/client";
import { Config } from "../../../../Config";
import { isKeyValueObject, isPropertyValue } from "../../../../utils";
import { ValueObject } from "../../ValueObject";
import {
  DateProperty,
  MultiSelectProperty,
  SelectProperty,
  VisiblePropsTypes,
} from "./default";

const { VISIBLE_PROPS } = Config.Notion;

const parse = (propValues: Prisma.JsonValue[]) => {
  if (
    !propValues ||
    typeof propValues !== "object" ||
    !Array.isArray(propValues)
  ) {
    throw new Error("propValues must be an object");
  }
  return propValues
    .filter((item) => {
      return item === null || typeof item !== "object" || Array.isArray(item);
    })
    .filter((item) => isKeyValueObject(item))
    .map((item) => item as { [key: string]: unknown });
};

export class VisibleProperties extends ValueObject<VisiblePropsTypes[]> {
  static create(propValues: Prisma.JsonValue[]): VisibleProperties {
    const props: VisiblePropsTypes[] = [];
    const parsedProps = parse(propValues);
    for (const key in parsedProps) {
      const propValue = parsedProps[key];
      if (!VISIBLE_PROPS.includes(key)) continue;
      if (!isPropertyValue(propValue)) continue;
      switch (propValue.type) {
        case "multi_select": {
          props.push(MultiSelectProperty.create({ key, propValue }));
          break;
        }
        case "date": {
          props.push(DateProperty.create({ key, propValue }));
          break;
        }
        case "select": {
          props.push(SelectProperty.create({ key, propValue }));
          break;
        }
        default:
          break;
      }
    }
    return new VisibleProperties(props);
  }
}
