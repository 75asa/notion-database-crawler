import { PropertyValueTitle } from "~/@types/notion-api-types";

interface MentionProps {
  mention: Pick<PropertyValueTitle["type"], "mention">;
  text: string;
  link: {
    url: string;
  } | null;
}
export const Mention = (props: MentionProps) => {
  const { text, link } = props;
  if (!link) return <>{text}</>;
  return (
    <>
      <a href={link.url}>{text}</a>
    </>
  );
};
