import { Block } from "@notionhq/client/build/src/api-types";
import JSXSlack from "jsx-slack";
import { BulletedListItem } from "./blocks/BulletedListItem";
import { ValueObject } from "./ValueObject";

interface ContentBlockProps {
  blocks: Block[];
  elements: JSXSlack.JSX.Element[];
}

export class ContentBlock extends ValueObject<ContentBlockProps> {
  static create(blocks: Block[]) {
    const jsxElements: JSXSlack.JSX.Element[] = [];
    for (const block of blocks) {
      switch (block.type) {
        case "bulleted_list_item":
          jsxElements.push(BulletedListItem(block));
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
    return new ContentBlock({ blocks, elements: jsxElements });
  }

  get elements(): JSXSlack.JSX.Element[] {
    return this.props.elements;
  }

}
