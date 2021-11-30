import { Prisma } from ".prisma/client";
import { isPropertyValue, parsePrismaJsonObject } from "~/utils";
import { Config } from "~/config";
import JSXSlack, { Field, Section } from "jsx-slack";
import { MultiSelectProperty } from "~/model/valueObject/slack/notion/properties/MultiSelectProperty";
import { DateProperty } from "~/model/valueObject/slack/notion/properties/DateProperty";
import { SelectProperty } from "~/model/valueObject/slack/notion/properties/SelectProperty";

const { VISIBLE_PROPS } = Config.Notion;

interface PropertiesProps {
  properties: Prisma.JsonObject;
}

export const Properties = ({ properties }: PropertiesProps) => {
  const parsed = parsePrismaJsonObject(properties);
  const element: JSXSlack.JSX.Element[] = [];

  for (const { key, value } of parsed) {
    if (!VISIBLE_PROPS.includes(key)) continue;
    if (!isPropertyValue(value)) continue;
    switch (value.type) {
      case "multi_select": {
        element.push(<MultiSelectProperty key={key} property={value} />);
        break;
      }
      case "date": {
        element.push(<DateProperty key={key} property={value} />);
        break;
      }
      case "select": {
        element.push(<SelectProperty key={key} property={value} />);
        break;
      }
      default:
        break;
    }
  }

  return (
    <>
      <Section>
        <p>
          <i>Properties</i>
        </p>
        {element.map((item) => (
          <Field>{item}</Field>
        ))}
      </Section>
    </>
  );
};
