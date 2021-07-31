import { ChatPostMessageArguments, WebClient } from "@slack/web-api";
import { jsxslack } from "jsx-slack";
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

  private blocks(text: string) {
    return jsxslack`
      <Blocks>
        <Section>
          <p>${text}</p>
        </Section>
      </Blocks>
    `;
  }

  async postMessage(arg: PostMessageArg) {
    const text = `${arg.databaseName} に新しいページ: <${arg.page.url}|${arg.page.name}> が投稿されました`;
    const msgOption: ChatPostMessageArguments = {
      channel: Config.Slack.CHANNEL_NAME,
      text,
      blocks: this.blocks(text),
    };

    if (arg.user) {
      const { name, avatarURL } = arg.user.props;
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
