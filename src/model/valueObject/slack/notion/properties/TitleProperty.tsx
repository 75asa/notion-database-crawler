import JSXSlack from "jsx-slack";
import { PropertyValueTitle } from "~/@types/notion-api-types";
import { Annotations } from "~/model/valueObject/slack/notion/properties/component/Annotations";
import { Equation } from "~/model/valueObject/slack/notion/properties/component/Equation";
import { Mention } from "~/model/valueObject/slack/notion/properties/component/Mention";
import { Text } from "~/model/valueObject/slack/notion/properties/component/Text";

interface TitlePropertyProps {
  key: string;
  property: PropertyValueTitle;
}

export const TitleProperty = ({ key, property }: TitlePropertyProps) => {
  const reduced = property.title.reduce((acc, cur) => {
    const { annotations, type, plain_text, href } = cur;
    switch (type) {
      case "text": {
        const { content, link } = cur.text;
        const result = (
          <Annotations annotations={annotations}>
            <Text text={content} link={link} />
          </Annotations>
        );
        acc.push(result);
        return acc;
      }
      case "equation": {
        const result = (
          <Annotations annotations={annotations}>
            <Equation equation={cur.equation.expression} href={href} />
          </Annotations>
        );
        acc.push(result);
        return acc;
      }
      case "mention": {
        cur.mention.type;
        const result = (
          <Annotations annotations={annotations}>
            <Mention />
          </Annotations>
        );
        acc.push(result);
        return acc;
      }
      default:
        break;
    }
    return acc;
  }, [] as JSXSlack.JSX.Element[]);

  return (
    <>
      <p>
        <b>{key}</b>: {reduced}
      </p>
    </>
  );
};
