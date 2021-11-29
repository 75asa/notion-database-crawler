import { Blocks, Mrkdwn, Section, Divider } from "jsx-slack";
import { Database, Page } from "~/model/entity";
import { Properties } from "~/model/valueObject/slack/notion/Properties";

interface MainBlocksProps {
  database: Database;
  page: Page;
}

export const MainBlocks = ({ database, page }: MainBlocksProps) => {
  const { url, name, properties } = page;
  // console.dir({ properties }, { depth: null });
  return (
    <Blocks>
      <Properties properties={properties}></Properties>
      <Section>
        <Mrkdwn>
          <b>{database.name}</b> に新しいページ: <a href={url}>{name}</a>
          が投稿されました
        </Mrkdwn>
      </Section>
      <Divider />
      {/* {...contents} */}
    </Blocks>
  );
};
