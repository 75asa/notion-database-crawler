import { Block } from "@notionhq/client/build/src/api-types";
import { ChatPostMessageArguments, WebClient } from "@slack/web-api";
import JSXSlack from "jsx-slack";
import { Header } from "./blocks/Header";
import { Config } from "./Config";
import { Page } from "./model/entity/Page";
import { User } from "./model/entity/User";
import { ContentBlock } from "./model/valueObject/ContentsBlock";

export class Slack {
  private client;
  private contentsBlock;
  private text;
  constructor(contentsBlock: ContentBlock) {
    this.client = this.init();
    this.contentsBlock = contentsBlock;
  }

  private init() {
    return new WebClient(Config.Slack.BOT_TOKEN);
  }

  async postMessage(arg: { page: Page; databaseName: string; user: User }) {
    const text = `${arg.databaseName} に新しいページ: ${arg.page.name} が投稿されました`;
    const msgOption: ChatPostMessageArguments = {
      channel: Config.Slack.CHANNEL_NAME,
      text,
      username: arg.user.name,
      icon_ur: arg.user.avatarURL,
      unfurl_links: true,
      blocks: JSXSlack(Header(arg.databaseName!, arg.page)),
    };

    try {
      await this.client.chat.postMessage(msgOption);
    } catch (e) {
      throw e;
    }
  }
}
