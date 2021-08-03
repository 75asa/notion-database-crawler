/** @jsxImportSource jsx-slack **/
import { Blocks, Section } from "jsx-slack";
import { Page } from "src/model/entity/Page";

export const Header = (databaseName: string, page: Page) => {
  return (
    <Blocks>
      <Section>
        <b>${databaseName}</b> に新しいページ:{" "}
        <a href={page.url}>{page.name}</a>が投稿されました
      </Section>
    </Blocks>
  );
};
