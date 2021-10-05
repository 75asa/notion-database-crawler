/** @jsxImportSource jsx-slack **/
import { Blocks, Mrkdwn, Section } from "jsx-slack";
import { Page } from "model/entity/Page";

export const Header = (databaseName: string, page: Page) => {
  return (
    <Blocks>
      <Section>
        <Mrkdwn>
          <b>{databaseName}</b> に新しいページ:{" "}
          <a href={page.url}>{page.name}</a>
          が投稿されました
        </Mrkdwn>
      </Section>
    </Blocks>
  );
};
