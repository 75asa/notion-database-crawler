import { Prisma } from ".prisma/client";
import { isPrismaJsonObject, isPropertyValue } from "~/utils";
import { Config } from "~/config";
import JSXSlack from "jsx-slack";
import { MultiSelectProperty } from "~/model/valueObject/slack/notion/properties/MultiSelectProperty";
import { DateProperty } from "~/model/valueObject/slack/notion/properties/DateProperty";
import { SelectProperty } from "~/model/valueObject/slack/notion/properties/SelectProperty";

const { VISIBLE_PROPS } = Config.Notion;

interface PropertiesProps {
  properties: Prisma.JsonObject;
}

const parse = (propValues: Prisma.JsonValue) => {
  if (
    !propValues ||
    typeof propValues !== "object" ||
    Array.isArray(propValues)
  ) {
    throw new Error("propValues must be an object");
  }
  const result = [];
  for (const key in propValues) {
    if (!key) continue;
    const value = propValues[key];
    if (!value) continue;
    if (!isPrismaJsonObject(value)) continue;
    result.push({ key, value });
  }
  return result;
};

export const Properties = ({ properties }: PropertiesProps) => {
  const parsed = parse(properties);
  console.dir({ parsed, VISIBLE_PROPS }, { depth: null });
  const element: JSXSlack.JSX.Element[] = [];

  for (const { key, value } of parsed) {
    if (!VISIBLE_PROPS.includes(key)) continue;
    if (!isPropertyValue(value)) continue;
    switch (value.type) {
      case "multi_select": {
        element.push(
          <MultiSelectProperty key={key} property={value}></MultiSelectProperty>
        );
        break;
      }
      case "date": {
        element.push(<DateProperty key={key} property={value}></DateProperty>);
        break;
      }
      case "select": {
        element.push(
          <SelectProperty key={key} property={value}></SelectProperty>
        );
        break;
      }
      default:
        break;
    }
  }
  return <>{element.map((item) => item)}</>;
};
