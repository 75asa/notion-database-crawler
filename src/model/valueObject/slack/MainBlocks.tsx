import { Blocks, Mrkdwn, Section, Divider } from "jsx-slack";
import { Database, Page } from "~/model/entity";
import { HeaderBlock } from "~/model/valueObject/slack/Header";
import { Properties } from "~/model/valueObject/slack/notion/Properties";

interface MainBlocksProps {
  database: Database;
  page: Page;
}

export const MainBlocks = ({ database, page }: MainBlocksProps) => {
  return (
    <Blocks>
      <HeaderBlock database={database} page={page} />
      <Properties properties={page.properties} />
      {/* NOTE: 2つのリンクを載せると unfurler が機能しない */}
      {/* <Section>
        <Mrkdwn>
          posted at <a href={database.url}>{database.name}</a>
        </Mrkdwn>
      </Section> */}
      <Divider />
      {/* TODO: content block */}
    </Blocks>
  );
};
