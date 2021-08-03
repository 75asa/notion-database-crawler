import { ChatPostMessageArguments, WebClient } from "@slack/web-api";
import JSXSlack from "jsx-slack";
import { Header } from "./blocks/Header";
import { Config } from "./Config";
import { Page } from "./model/entity/Page";
import { User } from "./model/entity/User";

export class Slack {
  private client;
  private jsxElements: JSXSlack.JSX.Element[] = [];
  constructor() {
    this.client = this.init();
  }

  private init() {
    return new WebClient(Config.Slack.BOT_TOKEN);
  }

  setBlocks(arg: { page: Page; databaseName: string; user: User, elements: JSXSlack.JSX.Element[]}) {
    return JSXSlack(Header(arg.databaseName!, arg.page, elements));
  }

  async postMessage(arg: { page: Page; databaseName: string; user: User, elements: JSXSlack.JSX.Element[]}) {
    const text = `${arg.databaseName} に新しいページ: ${arg.page.name} が投稿されました`;
    const msgOption: ChatPostMessageArguments = {
      channel: Config.Slack.CHANNEL_NAME,
      text,
      username: arg.user.name,
      icon_ur: arg.user.avatarURL,
      unfurl_links: true,
      blocks: this.setBlocks({databaseName: arg.databaseName!, page: arg.page, elements}))
    };

    try {
      await this.client.chat.postMessage(msgOption);
    } catch (e) {
      throw e;
    }
  }
}
