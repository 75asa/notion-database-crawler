import { Page, User } from "@prisma/client";
import {
  ChatPostMessageArguments,
  KnownBlock,
  WebClient,
} from "@slack/web-api";
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

  private getBlocks(page: Page) {
    const text = `新しいページが投稿されました ${page.url}`;
    const blocks: KnownBlock[] = [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text,
        },
      },
    ];
    return blocks;
  }

  private getOption(page: Page, user?: User) {
    const msgOption: ChatPostMessageArguments = {
      channel: Config.Slack.CHANNEL_NAME,
      blocks: this.getBlocks(page),
    };

    if (user) {
      msgOption.as_user = true;
      msgOption.username = user.name;
      msgOption.icon_url = user.avatarURL;
    }

    return msgOption;
  }

  async postMessage(arg: PostMessageArg) {
    try {
      await this.client.chat.postMessage(this.getOption(arg.page, arg.user));
    } catch (e) {
      console.error(e);
    }
  }
}
