import { Prisma, User } from "@prisma/client";
import {
  ChatPostMessageArguments,
  KnownBlock,
  WebClient,
} from "@slack/web-api";

export class Slack {
  private client;
  private message;
  private blocks;
  constructor(
    message: string,
    pageCreateManyInput: Prisma.PageCreateManyInput,
    user?: User
  ) {
    this.client = this.init();
    this.message = message;
    this.blocks = this.makeBlock(pageCreateManyInput, user);
  }

  init() {
    const token = process.env.SLACK_BOT_TOKEN;
    if (!token) throw "SLACK_BOT_TOKEN not found";
    return new WebClient(token);
  }

  private makeBlock(
    pageCreateManyInput: Prisma.PageCreateManyInput,
    user?: User
  ) {
    const blocks: KnownBlock[] = [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: this.message,
        },
      },
    ];
    return blocks;
  }

  async sendMessage() {
    const msgOption: ChatPostMessageArguments = {
      channel: process.env.CHANNEL_NAME!,
      as_user: true,
      icon_url: "user.avatarURL",
      text: this.message,
      blocks: this.blocks,
    };
    await this.client.chat.postMessage(msgOption);
  }
}
