/** @jsxImportSource jsx-slack **/
import { RichTextText as NotionRichTextText } from "@notionhq/client/build/src/api-types";
import { Annotations } from "./Annotations";

interface RichTextTextProps {
  children: NotionRichTextText;
}

export const RichTextText = ({ children }: RichTextTextProps) => {
  return (
    <>
      <Annotations>{children}</Annotations>
    </>
  );
};
