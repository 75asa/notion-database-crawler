import JSXSlack from "jsx-slack";
import { VisibleProperties } from "..";
import { Page } from "../../entity";
import { ValueObject } from "../ValueObject";

interface BlockKitProps {
  element: JSXSlack.JSX.Element;
}

interface BlockKitCreateArgs {
  page: Page;
}

export class BlockKit extends ValueObject<BlockKitProps> {
  static create({ page }: BlockKitCreateArgs): BlockKit {
    // TODO: rawProperties
    const { rawProperties } = page;
    const visibleProperties = VisibleProperties.create();
    new BlockKit({ element: rawProperties });
  }

  get element(): JSXSlack.JSX.Element {
    return this.props.element;
  }
}
