import { RichTextText as RichTextTextType } from "~/@types/notion-api-types";
import { Annotations } from "~/model/valueObject/notion/blocks/Annotations";

interface RichTextTextProps {
  children: RichTextTextType;
}

export const RichTextText = ({ children }: RichTextTextProps) => {
  return <Annotations>{children}</Annotations>;
};
