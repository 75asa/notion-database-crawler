/** @jsxImportSource jsx-slack **/
import JSXSlack, { Blocks, Mrkdwn, Section, Divider } from "jsx-slack";
import { Database, Page } from "../../entity";

export const MainBlocks = (input: { database: Database; page: Page }) => {
  const { database, page } = input;
  const { rawProperties } = page;
  return (
    <Blocks>
      <Section>
        <Mrkdwn>
          <b>{database.name}</b> に新しいページ:{" "}
          <a href={page.url}>{page.name}</a>
          が投稿されました
        </Mrkdwn>
      </Section>
      <Divider />
      {/* {...contents} */}
    </Blocks>
  );
};
