// import JSXSlack from "jsx-slack";
// import { Page } from "~/model/entity";
// import { VisibleProperties } from "~/model/valueObject";
// import { ValueObject } from "~/model/valueObject/ValueObject";

// interface BlockKitProps {
//   element: JSXSlack.JSX.Element;
// }

// interface BlockKitCreateArgs {
//   page: Page;
// }

// export class BlockKit extends ValueObject<BlockKitProps> {
//   static create({ page }: BlockKitCreateArgs): BlockKit {
//     // TODO: rawProperties
//     const { properties } = page;
//     const visibleProperties = VisibleProperties.create(properties).props;
//     new BlockKit({ element: properties });
//   }

//   get element(): JSXSlack.JSX.Element {
//     return this.props.element;
//   }
// }
