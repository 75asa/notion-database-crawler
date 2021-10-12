import { Block } from "@notionhq/client/build/src/api-types";
import { ChatPostMessageArguments, WebClient } from "@slack/web-api";
import { MainAttachments } from "./attachments/MainAttachments";
import JSXSlack from "jsx-slack";
import { MainBlocks } from "./blocks/MainBlocks";
import { Config } from "./Config";
import { Page } from "./model/entity/Page";
import { User } from "./model/entity/User";
import { ContentBlock } from "./model/valueObject/ContentsBlock";

export class Slack {
  private client;
  private contentsBlock;
  private blocks;
  constructor(blocks: Block[]) {
    this.client = this.init();
    this.contentsBlock = ContentBlock.create(blocks);
    this.blocks = blocks;
  }

  private init() {
    return new WebClient(Config.Slack.BOT_TOKEN);
  }

  async postMessage(arg: { page: Page; databaseName: string; user: User }) {
    const { databaseName, page, user } = arg;
    const { url, name } = page;
    const text = `${databaseName} に新しいページ: <${url}|${name}> が投稿されました`;
    const block = MainBlocks(databaseName, page, this.contentsBlock.elements);
    const translatedBlocks = JSXSlack(block);
    const attachments = MainAttachments(this.blocks);

    const msgOption: ChatPostMessageArguments = {
      channel: Config.Slack.CHANNEL_NAME,
      text,
      username: user.name,
      icon_url: user.avatarURL,
      unfurl_links: true,
      blocks: translatedBlocks,
      attachments,
    };

    console.dir({ msgOption }, { depth: null });

    try {
      await this.client.chat.postMessage(msgOption);
    } catch (e) {
      if (e instanceof Error) throw e;
    }
  }
}
