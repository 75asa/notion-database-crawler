import { PropertyValueTitle } from "~/@types/notion-api-types";
import { Annotations } from "~/model/valueObject/notion/blocks/Annotations";

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
          <Annotations>
            <Text text={content} link={link} />
          </Annotations>
        );
        return acc + plain_text;
      }
      case "equation": {
        return acc + `<span class="equation">${plain_text}</span>`;
      }
      case "mention": {
        return acc + `<a href="${annotations[0].target}">${plain_text}</a>`;
      }
      default:
        break;
    }
    return acc;
  }, "");

  return (
    <>
      <p>
        <b>{key}</b>: {property.title}
      </p>
    </>
  );
};
