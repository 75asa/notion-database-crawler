import { RichTextText } from "@notionhq/client/build/src/api-types";
import { Fragment } from "jsx-slack";

interface AnnotationsProps {
  children: RichTextText;
}
export const Annotations = ({ children }: AnnotationsProps) => {
  const content = children.text.content;
  const { annotations, text } = children;
  let blocks = !!text.link ? (
    <Fragment>
      <a href={text.link!.url}>{content}</a>
    </Fragment>
  ) : (
    <Fragment>
      <p>{content}</p>
    </Fragment>
  );
  for (const annotation in annotations) {
    switch (annotation) {
      case "bold":
        if (!annotations[annotation]) break;
        blocks = (
          <Fragment>
            <b>{blocks}</b>
          </Fragment>
        );
        break;
      case "italic":
        if (!annotations[annotation]) break;
        blocks = (
          <Fragment>
            <i>{blocks}</i>
          </Fragment>
        );
        break;
      case "strikethrough":
        if (!annotations[annotation]) break;
        blocks = (
          <Fragment>
            <strike>{blocks}</strike>
          </Fragment>
        );
        break;
      case "code":
        if (!annotations[annotation]) break;
        blocks = (
          <Fragment>
            <code>{blocks}</code>
          </Fragment>
        );
        break;
      case "default":
        // underline, color
        break;
    }
  }

  return blocks;
};
