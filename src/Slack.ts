import { Block } from "@notionhq/client/build/src/api-types";
import { ChatPostMessageArguments, WebClient } from "@slack/web-api";
import JSXSlack from "jsx-slack";
import { MainBlocks } from "./blocks/MainBlocks";
import { Config } from "./Config";
import { Page } from "./model/entity/Page";
import { User } from "./model/entity/User";
import { ContentBlock } from "./model/valueObject/ContentsBlock";

export class Slack {
  private client;
  private contentsBlock;
  constructor(blocks: Block[]) {
    this.client = this.init();
    this.contentsBlock = ContentBlock.create(blocks);
  }

  private init() {
    return new WebClient(Config.Slack.BOT_TOKEN);
  }

  async postMessage(arg: { page: Page; databaseName: string; user: User }) {
    const text = `${arg.databaseName} に新しいページ: ${arg.page.name} が投稿されました`;
    const block = MainBlocks(
      arg.databaseName!,
      arg.page,
      this.contentsBlock.elements
    );
    const translatedBlocks = JSXSlack(block);
    const msgOption: ChatPostMessageArguments = {
      channel: Config.Slack.CHANNEL_NAME,
      text,
      username: arg.user.name,
      icon_ur: arg.user.avatarURL,
      unfurl_links: true,
      blocks: translatedBlocks,
    };

    try {
      await this.client.chat.postMessage(msgOption);
    } catch (e) {
      throw e;
    }
  }
}
