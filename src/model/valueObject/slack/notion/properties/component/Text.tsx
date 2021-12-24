interface TextProps {
  text: string;
  link: {
    url: string;
  } | null;
}
export const Text = (props: TextProps) => {
  const { text, link } = props;
  if (!link) return <>{text}</>;
  return (
    <>
      <a href={link.url}>{text}</a>
    </>
  );
};
