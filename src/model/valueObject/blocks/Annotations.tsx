import { RichTextText } from '@notionhq/client/build/src/api-types';

interface AnnotationsProps {
  richText: RichTextText;
}
export const Annotations = ({ richText }: AnnotationsProps) => {
  const { text, annotations } = richText;
  const content = text.content;

  let blocks =
    text.link != null ? (
      <a href={text.link!.url}>{content}</a>
    ) : (
      <p>{content}</p>
    );

  for (const annotation in annotations) {
    switch (annotation) {
      case 'bold':
        if (!annotations[annotation]) break;
        blocks = <b>{blocks}</b>;
        break;
      case 'italic':
        if (!annotations[annotation]) break;
        blocks = <i>{blocks}</i>;
        break;
      case 'strikethrough':
        if (!annotations[annotation]) break;
        blocks = <strike>{blocks}</strike>;
        break;
      case 'code':
        if (!annotations[annotation]) break;
        blocks = <code>{blocks}</code>;
        break;
      case 'default':
        // underline, color
        break;
    }
  }

  return blocks;
};
