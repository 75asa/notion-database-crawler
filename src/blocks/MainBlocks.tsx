/** @jsxImportSource jsx-slack **/
import JSXSlack, { Blocks, Divider, Section } from "jsx-slack";
import { Page } from "src/model/entity/Page";

export const MainBlocks = (
  databaseName: string,
  page: Page,
  contents: JSXSlack.JSX.Element[]
) => {
  return (
    <Blocks>
      <Section>
        <b>{databaseName}</b> に新しいページ: <a href={page.url}>{page.name}</a>
        が投稿されました
      </Section>
      <Divider />
      {...contents}
    </Blocks>
  );
};
