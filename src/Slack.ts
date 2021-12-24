import { ChatPostMessageArguments, WebClient } from "@slack/web-api";
import JSXSlack from "jsx-slack";
import { Page, Database, User } from "~/model/entity";
import { MainBlocks } from "~/model/valueObject/slack/MainBlocks";

interface SlackConstructorArgs {
  BOT_TOKEN?: string;
  CHANNEL_NAMES: string[];
}

export class Slack {
  #client;
  #channels: string[];
  constructor(args: SlackConstructorArgs) {
    const { CHANNEL_NAMES, BOT_TOKEN } = args;
    if (!CHANNEL_NAMES.length) throw new Error("no channel name");
    if (!BOT_TOKEN) throw new Error("no bot token");
    this.#channels = CHANNEL_NAMES;
    this.#client = new WebClient(BOT_TOKEN);
  }

  #buildMessage(input: { page: Page; database: Database }) {
    const { database, page } = input;
    const { url, name } = page;
    return `${database.name} に新しいページ: <${url}|${name}> が投稿されました`;
  }

  async postMessage(input: { page: Page; database: Database; user: User }) {
    const { database, page, user } = input;
    const text = this.#buildMessage({ page, database });
    // Block kit
    const block = MainBlocks({ database, page });
    // console.dir({ block }, { depth: null });
    const translatedBlocks = JSXSlack(block);

    const msgOptions: ChatPostMessageArguments[] = this.#channels.map(
      (channel) => {
        return {
          channel,
          text,
          username: user.name,
          icon_url: user.avatarURL,
          // icon_url: user.avatarURL, TODO: user.resizedURL ?? user.avatarURL のようにしたい
          unfurl_links: true,
          blocks: translatedBlocks,
        };
      }
    );

    console.dir({ msgOptions }, { depth: null });

    try {
      await Promise.all(
        msgOptions.map(async (option) => this.#client.chat.postMessage(option))
      );
    } catch (e) {
      if (e instanceof Error) throw e;
    }
  }
}
