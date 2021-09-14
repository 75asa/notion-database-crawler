/** @jsxImportSource jsx-slack **/
import { RichTextText as RichTextTextType } from '@notionhq/client/build/src/api-types';
import { Annotations } from './Annotations';

interface RichTextTextProps {
  text: RichTextTextType;
}

export const RichTextText = ({ text }: RichTextTextProps) => {
  return <Annotations richText={text} />;
};
