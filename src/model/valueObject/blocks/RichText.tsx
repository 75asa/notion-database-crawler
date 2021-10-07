/** @jsxImportSource jsx-slack **/
import { RichTextText as RichTextTextType } from "@notionhq/client/build/src/api-types";
import { Annotations } from "./Annotations";

interface RichTextTextProps {
  children: RichTextTextType;
}

export const RichTextText = ({ children }: RichTextTextProps) => {
  return <Annotations>{children}</Annotations>;
};
