import JSXSlack from "jsx-slack";
import { Annotations as AnnotationsType } from "~/@types/notion-api-types";

interface AnnotationsProps {
  children: JSXSlack.JSX.Element;
  annotations: AnnotationsType;
}

export const Annotations = ({
  children: text,
  annotations,
}: AnnotationsProps) => {
  let annotated = text;
  for (const annotation in annotations) {
    if (!annotations[annotation as keyof AnnotationsType]) continue;
    switch (annotation) {
      case "bold":
        annotated = <b>{annotated}</b>;
        break;
      case "italic":
        annotated = <i>{annotated}</i>;
        break;
      case "strikethrough":
        annotated = <strike>{annotated}</strike>;
        break;
      case "code":
        annotated = <code>{annotated}</code>;
        break;
      case "default":
        // underline, color
        break;
    }
  }
  return annotated;
};
