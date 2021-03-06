import JSXSlack, { Section } from "jsx-slack";
import { BulletedListItemBlock } from "~/@types/notion-api-types";
import { RichTextText } from "~/model/valueObject/notion/blocks/RichText";

interface BulletedListItemProps {
  children: BulletedListItemBlock;
}

export const BulletedListItem = (props: BulletedListItemProps) => {
  const bulletedListItems = props.children.bulleted_list_item.text
    .map((text) => {
      switch (text.type) {
        case "text":
          text;
          return <RichTextText>{text}</RichTextText>;
        case "equation":
          text;
          break;
        case "mention":
          text;
          break;
      }
    })
    .filter(
      (item): item is Exclude<typeof item, undefined> => item !== undefined
    );

  return (
    <Section>
      <ul>
        {/* {JSXSlack.Children.toArray(bulletedListItems).map((item) => (
          <li>{item}</li>
        ))} */}
      </ul>
    </Section>
  );
};
