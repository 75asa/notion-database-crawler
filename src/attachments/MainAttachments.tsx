import {
  Block,
  HeadingOneBlock,
  HeadingThreeBlock,
  HeadingTwoBlock,
  RichText,
} from "@notionhq/client/build/src/api-types";
import { ChatPostMessageArguments } from "@slack/web-api";

const getHeadingText = (
  block: HeadingOneBlock | HeadingTwoBlock | HeadingThreeBlock
) => {
  if (block.type === "heading_1") return block.heading_1.text;
  else if (block.type === "heading_2") return block.heading_2.text;
  else return block.heading_3.text;
};

const createTextLine = (
  richTextList: RichText[] | undefined,
  callback: (arg: RichText) => void
) => {
  richTextList?.forEach((text) => callback(text));
};

export const MainAttachments = (blocks: Block[], pageName: string) => {
  const attachments: NonNullable<
    ChatPostMessageArguments["attachments"]
  >[number] = {
    mrkdwn_in: ["text"],
    text: "",
  };

  attachments.title = pageName;

  blocks.forEach((block) => {
    let textLine = "";
    switch (block.type) {
      case "numbered_list_item":
      case "bulleted_list_item":
        createTextLine(
          block.type === "bulleted_list_item"
            ? block.bulleted_list_item.text
            : block.numbered_list_item.text,
          (text) => {
            if (text.href != null) {
              textLine += `<${text.href}|${text.plain_text}>`;
            } else if (
              Object.values(text.annotations).every(
                (annotation) => annotation === false || annotation === "default"
              )
            ) {
              textLine += text.plain_text;
            } else {
              (
                Object.keys(
                  text.annotations
                ) as (keyof typeof text.annotations)[]
              ).forEach((key) => {
                if (text.annotations[key]) {
                  switch (key) {
                    case "bold":
                      textLine += `*${text.plain_text}* `;
                      break;
                    case "italic":
                      textLine += `_${text.plain_text}_ `;
                      break;
                    case "strikethrough":
                      textLine += `~${text.plain_text}~ `;
                      break;
                    case "code":
                      textLine += `\`${text.plain_text}\` `;
                      break;
                    default:
                      // textLine += text.plain_text;
                      // underline, color
                      break;
                  }
                }
              });
            }
          }
        );

        if (block.type === "bulleted_list_item") {
          attachments.text += `・ ${textLine}\n`;
        } else {
          // numbered list
        }
        break;
      case "child_page":
        break;
      case "heading_1":
      case "heading_2":
      case "heading_3":
        createTextLine(getHeadingText(block), (text) => {
          textLine += `*${text.plain_text}*\n`;
        });
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
  });

  return [attachments];
};
