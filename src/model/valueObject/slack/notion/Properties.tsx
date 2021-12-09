import { Prisma } from ".prisma/client";
import { isPropertyValue, parsePrismaJsonObject } from "~/utils";
import { Config } from "~/Config";
import JSXSlack, { Field, Section } from "jsx-slack";
import { MultiSelectProperty } from "~/model/valueObject/slack/notion/properties/MultiSelectProperty";
import { DateProperty } from "~/model/valueObject/slack/notion/properties/DateProperty";
import { SelectProperty } from "~/model/valueObject/slack/notion/properties/SelectProperty";
import { CheckboxProperty } from "~/model/valueObject/slack/notion/properties/Checkbox";
import { CreatedTimeProperty } from "~/model/valueObject/slack/notion/properties/CreatedTimeProperty";
import { EmailProperty } from "~/model/valueObject/slack/notion/properties/EmailProperty";
import { LastEditedTimeProperty } from "~/model/valueObject/slack/notion/properties/LastEditedTimeProperty";
import { NumberProperty } from "~/model/valueObject/slack/notion/properties/NumberProperty";
import { PhoneNumberProperty } from "~/model/valueObject/slack/notion/properties/PhoneNumberProperty";
import { RelationProperty } from "~/model/valueObject/slack/notion/properties/RelationProperty";
import { UrlProperty } from "~/model/valueObject/slack/notion/properties/UrlProperty";
import { TitleProperty } from "~/model/valueObject/slack/notion/properties/TitleProperty";

const { VISIBLE_PROPS } = Config.Notion;

interface PropertiesProps {
  properties: Prisma.JsonObject;
}

export const Properties = ({ properties }: PropertiesProps) => {
  const parsed = parsePrismaJsonObject(properties);
  const element: JSXSlack.JSX.Element[] = [];

  for (const VISIBLE_PROP of VISIBLE_PROPS) {
    const parsedProp = parsed.find((p) => p.key === VISIBLE_PROP);
    if (!parsedProp) continue;
    const { key, value } = parsedProp;
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
      case "checkbox": {
        element.push(<CheckboxProperty key={key} property={value} />);
        break;
      }
      case "created_time": {
        element.push(<CreatedTimeProperty key={key} property={value} />);
        break;
      }
      case "email": {
        element.push(<EmailProperty key={key} property={value} />);
        break;
      }
      case "last_edited_time": {
        element.push(<LastEditedTimeProperty key={key} property={value} />);
        break;
      }
      case "number": {
        element.push(<NumberProperty key={key} property={value} />);
        break;
      }
      case "phone_number": {
        element.push(<PhoneNumberProperty key={key} property={value} />);
        break;
      }
      case "relation": {
        element.push(<RelationProperty key={key} property={value} />);
        break;
      }
      case "url": {
        element.push(<UrlProperty key={key} property={value} />);
        break;
      }
      case "title": {
        element.push(<TitleProperty key={key} property={value} />);
        break;
      }

      default:
        break;
    }
  }

  if (!element.length) return <></>;

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
