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

  async postMessage(arg: PostMessageArg) {
    const text = `${arg.databaseName} に新しいページ: <${arg.page.url}|${arg.page.name}> が投稿されました`;
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
      channel: Config.Slack.CHANNEL_NAME,
      text,
      blocks: blocks,
    };

    if (arg.user) {
      msgOption.username = arg.user.name;
      msgOption.icon_url = arg.user.avatarURL;
    }
    await this.client.chat.postMessage(msgOption);
  }
}
