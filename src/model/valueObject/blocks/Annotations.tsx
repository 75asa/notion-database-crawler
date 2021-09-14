import {
  Annotations as AnnotationsType,
  RichTextText,
} from "@notionhq/client/build/src/api-types";

interface AnnotationsProps {
  children: RichTextText;
}
export const Annotations = ({ children }: AnnotationsProps) => {
  const content = children.text.content;
  const { annotations, text } = children;
  let blocks = !!text.link ? (
    <a href={text.link!.url}>{content}</a>
  ) : (
    <p>{content}</p>
  );

  for (const annotation in annotations) {
    if (!annotations[annotation as keyof AnnotationsType]) continue;
    switch (annotation) {
      case "bold":
        blocks = <b>{blocks}</b>;
        break;
      case "italic":
        blocks = <i>{blocks}</i>;
        break;
      case "strikethrough":
        blocks = <strike>{blocks}</strike>;
        break;
      case "code":
        blocks = <code>{blocks}</code>;
        break;
      case "default":
        // underline, color
        break;
    }
  }

  return blocks;
};
