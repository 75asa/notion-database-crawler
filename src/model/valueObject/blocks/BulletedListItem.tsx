/** @jsxImportSource jsx-slack **/
import { Section } from "jsx-slack";
import { BulletedListItemBlock } from "@notionhq/client/build/src/api-types";
import { RichTextText } from "./RichText";

interface BulletedListItemProps {
  children: BulletedListItemBlock;
}

export const BulletedListItem = (props: BulletedListItemProps) => {
  const bulletedListItems = props.children.bulleted_list_item.text.map(text => {
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
  });
  // TODO: ワンラインになるか確認
  return (
    <Section>
      <b>-</b> {...bulletedListItems}
    </Section>
  );
};
