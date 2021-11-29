/** @jsxImportSource jsx-slack **/
import JSXSlack, { Blocks, Mrkdwn, Section, Divider } from "jsx-slack";
import { Page } from "~/model/entity/Page";

export const MainBlocks = (
  databaseName: string,
  page: Page,
  contents: JSXSlack.JSX.Element[]
) => {
  return (
    <Blocks>
      <Section>
        <Mrkdwn>
          <b>{databaseName}</b> に新しいページ:{" "}
          <a href={page.url}>{page.name}</a>
          が投稿されました
        </Mrkdwn>
      </Section>
      <Divider />
      {/* {...contents} */}
    </Blocks>
  );
};
