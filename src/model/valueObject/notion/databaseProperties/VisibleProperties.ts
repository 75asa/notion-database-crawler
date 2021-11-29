import { Prisma } from ".prisma/client";
import { Config } from "~/Config";
import {
  VisiblePropsTypes,
  MultiSelectProperty,
  DateProperty,
  SelectProperty,
} from "~/model/valueObject";
import { ValueObject } from "~/model/valueObject/ValueObject";
import { isKeyValueObject, isPropertyValue } from "~/utils";

const { VISIBLE_PROPS } = Config.Notion;

const parse = (propValues: Prisma.JsonValue) => {
  if (
    !propValues ||
    typeof propValues !== "object" ||
    Array.isArray(propValues)
  ) {
    throw new Error("propValues must be an object");
  }
  const result = [];
  for (const key in Object.keys(propValues)) {
    if (!key) continue;
    const value = propValues[key];
    if (!isKeyValueObject(value)) continue;
    value as { [key: string]: unknown };
    result.push({ key, value });
  }
  return result;
};

export class VisibleProperties extends ValueObject<VisiblePropsTypes[]> {
  static create(propValues: Prisma.JsonObject): VisibleProperties {
    const props: VisiblePropsTypes[] = [];
    const parsedProps = parse(propValues);
    for (const { key, value } of parsedProps) {
      if (!VISIBLE_PROPS.includes(key)) continue;
      if (!isPropertyValue(value)) continue;
      switch (value.type) {
        case "multi_select": {
          props.push(MultiSelectProperty.create({ key, value }));
          break;
        }
        case "date": {
          props.push(DateProperty.create({ key, value }));
          break;
        }
        case "select": {
          props.push(SelectProperty.create({ key, value }));
          break;
        }
        default:
          break;
      }
    }
    return new VisibleProperties(props);
  }
}
