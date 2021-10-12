import { Block } from "@notionhq/client/build/src/api-types";
import { ChatPostMessageArguments } from "@slack/web-api";

export const MainAttachments = (blocks: Block[]) => {
  const attachments: NonNullable<
    ChatPostMessageArguments["attachments"]
  >[number] = {
    mrkdwn_in: ["text"],
    text: "",
  };

  blocks.forEach((block) => {
    let textLine = "";
    switch (block.type) {
      case "bulleted_list_item":
        block.bulleted_list_item.text?.forEach((text) => {
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
              Object.keys(text.annotations) as (keyof typeof text.annotations)[]
            ).forEach((annotation) => {
              if (text.annotations[annotation]) {
                switch (annotation) {
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
        });
        attachments.text += `・ ${textLine}\n`;
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
  });

  return [attachments];
};
