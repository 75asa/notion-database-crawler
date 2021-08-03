import { ChatPostMessageArguments, WebClient } from "@slack/web-api";
import JSXSlack from "jsx-slack";
import { Header } from "./blocks/Header";
import { Config } from "./Config";
import { PostMessageArg } from "./types";

export class Slack {
  private client;
  constructor() {
    this.client = this.init();
  }

  private init() {
    return new WebClient(Config.Slack.BOT_TOKEN);
  }

  async postMessage(arg: PostMessageArg) {
    const text = `${arg.databaseName} に新しいページ: ${arg.page.name} が投稿されました`;
    const msgOption: ChatPostMessageArguments = {
      channel: Config.Slack.CHANNEL_NAME,
      text,
      blocks: JSXSlack(Header(arg.databaseName!, arg.page)),
    };

    if (arg.user) {
      const { name, avatarURL } = arg.user.allProps();
      msgOption.username = name;
      msgOption.icon_url = avatarURL;
    }

    try {
      await this.client.chat.postMessage(msgOption);
    } catch (e) {
      throw e;
    }
  }
}
