/** @jsxImportSource jsx-slack **/
import { Annotations } from "./Annotations";
import { RichTextText as RichTextTextType } from "../../../@types/notion-api-types";

interface RichTextTextProps {
  children: RichTextTextType;
}

export const RichTextText = ({ children }: RichTextTextProps) => {
  return <Annotations>{children}</Annotations>;
};
