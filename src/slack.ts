import { Prisma, User } from "@prisma/client";
import {
  ChatPostMessageArguments,
  KnownBlock,
  WebClient,
} from "@slack/web-api";
import { PostMessageArg } from "./types";

export class Slack {
  private client;
  constructor() {
    this.client = this.init();
  }

  private init() {
    const token = process.env.SLACK_BOT_TOKEN;
    if (!token) throw "SLACK_BOT_TOKEN not found";
    return new WebClient(token);
  }

  async postMessage(arg: PostMessageArg) {
    const text = `新しいページが投稿されました`;
    const blocks: KnownBlock[] = [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text,
        },
      },
    ];
    const msgOption: ChatPostMessageArguments = {
      channel: process.env.CHANNEL_NAME!,
      text,
      blocks: blocks,
    };

    if (arg.user) {
      msgOption.as_user = true;
      msgOption.icon_url = arg.user.avatarURL;
    }
    await this.client.chat.postMessage(msgOption);
  }
}
