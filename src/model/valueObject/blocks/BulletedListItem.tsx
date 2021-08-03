/** @jsxImportSource jsx-slack **/
import { Section } from "jsx-slack";
import { BulletedListItemBlock } from "@notionhq/client/build/src/api-types";
import { RichText } from "./RichText";

export const BulletedListItem = (props: BulletedListItemBlock) => {
  const result = props.bulleted_list_item.text.map(text => {
    switch (text.type) {
      case "text":
        text;
        return RichText(text);
      case "equation":
        text;
        // return RichTextEquation(text);
        break;
      case "mention":
        text;
        break;
    }
  });
  return <Section>- {...result}</Section>;
};
