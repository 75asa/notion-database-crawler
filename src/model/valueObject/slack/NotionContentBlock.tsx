import JSXSlack, { Blocks, Divider, Header } from "jsx-slack";
import { Block } from "~/@types/notion-api-types";
import { Page, User } from "~/model/entity";
import { BulletedListItem } from "~/model/valueObject/notion/blocks/BulletedListItem";
import { ValueObject } from "~/model/valueObject/ValueObject";

interface ContentBlockProps {
  blocks: Block[];
  elements: JSXSlack.JSX.Element[];
}

export class NotionContentBlock extends ValueObject<ContentBlockProps> {
  static create(blocks: Block[]) {
    const jsxElements: JSXSlack.JSX.Element[] = [];
    for (const block of blocks) {
      switch (block.type) {
        case "bulleted_list_item":
          jsxElements.push(<BulletedListItem>{block}</BulletedListItem>);
          break;
        case "child_page":
          break;
        case "heading_1":
          break;
        case "heading_2":
          break;
        case "heading_3":
          break;
        case "numbered_list_item":
          break;
        case "paragraph":
          break;
        case "to_do":
          break;
        case "toggle":
          break;
        case "unsupported":
          break;
      }
    }
    return new NotionContentBlock({ blocks, elements: jsxElements });
  }

  get elements(): JSXSlack.JSX.Element[] {
    return this.props.elements;
  }

  makeBlock(arg: { page: Page; databaseName: string; user: User }) {
    return (
      <Blocks>
        <Header>
          <b>{arg.databaseName}</b> に新しいページ:{" "}
          <a href={arg.page.url}>{arg.page.name}</a>
          が投稿されました
        </Header>
        <Divider />
        {...this.elements}
      </Blocks>
    );
  }
}
