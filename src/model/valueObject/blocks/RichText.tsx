/** @jsxImportSource jsx-slack **/
import { RichTextText } from "@notionhq/client/build/src/api-types";
import { Annotations } from "./Annotations";

export const RichText = (props: RichTextText) => {
  return Annotations(props.annotations, props.text);
};
