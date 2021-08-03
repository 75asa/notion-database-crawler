/** @jsxImportSource jsx-slack **/
import JSXSlack, { Blocks, Section } from "jsx-slack";
import { Page } from "src/model/entity/Page";

export const Header = (
  databaseName: string,
  page: Page,
  elements: JSXSlack.JSX.Element[]
) => {
  return (
    <Blocks>
      <Section>
        <b>{databaseName}</b> に新しいページ: <a href={page.url}>{page.name}</a>
        が投稿されました
        {...elements}
      </Section>
    </Blocks>
  );
};
