import { Annotations as NotionAnnotations } from "@notionhq/client/build/src/api-types";
// import { Bold } from "./Bold";

interface Text {
  content: string;
  link?:
    | {
        type: "url";
        url: string;
      }
    | undefined;
}

export const Annotations = (annotations: NotionAnnotations, text: Text) => {
  const content = text.content;
  let blocks = !!text.link ? (
    <a href={text.link!.url}>{content}</a>
  ) : (
    <p>{content}</p>
  );
  for (const annotation in annotations) {
    switch (annotation) {
      case "bold":
        if (!annotations[annotation]) break;
        blocks = <b>{blocks}</b>;
        // blocks = Bold(blocks);
        break;
      case "italic":
        if (!annotations[annotation]) break;
        blocks = <i>{blocks}</i>;
        break;
      case "strikethrough":
        if (!annotations[annotation]) break;
        blocks = <strike>{blocks}</strike>;
        break;
      case "code":
        if (!annotations[annotation]) break;
        blocks = <code>{blocks}</code>;
        break;
      case "default":
        // underline, color
        break;
    }
  }

  return blocks;
};
