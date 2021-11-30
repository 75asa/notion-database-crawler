import { Section, Mrkdwn } from "jsx-slack";
import { Database, Page } from "~/model/entity";

interface HeaderProps {
  database: Database;
  page: Page;
}

export const HeaderBlock = ({ database, page }: HeaderProps) => {
  const { name, url } = page;
  return (
    <>
      <Section>
        <Mrkdwn>
          <p>
            <b>{database.name}</b> に新しいページ: <a href={url}>{name}</a>{" "}
            が投稿されました
          </p>
        </Mrkdwn>
      </Section>
    </>
  );
};
