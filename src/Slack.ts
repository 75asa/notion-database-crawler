import { ChatPostMessageArguments, WebClient } from "@slack/web-api";
import JSXSlack from "jsx-slack";
import { Block } from "./@types/notion-api-types";
import { MainBlocks } from "./blocks/MainBlocks";
import { Config } from "./Config";
import { Page } from "./model/entity/Page";
import { User } from "./model/entity/User";
import { ContentBlock } from "./model/valueObject/ContentsBlock";

export class Slack {
  private client;
  private contentsBlock;
  private channels: string[];
  constructor(blocks: Block[]) {
    if (!Config.Slack.CHANNEL_NAMES.length) throw new Error("no channel name");
    this.channels = Config.Slack.CHANNEL_NAMES;
    this.client = this.init();
    this.contentsBlock = ContentBlock.create(blocks);
  }

  private init() {
    return new WebClient(Config.Slack.BOT_TOKEN);
  }

  async postMessage(input: { page: Page; databaseName: string; user: User }) {
    const { databaseName, page, user } = input;
    const { url, name, rawProperties } = page;
    const text = `${databaseName} に新しいページ: <${url}|${name}> が投稿されました`;
    const block = MainBlocks(databaseName, page, this.contentsBlock.elements);
    const translatedBlocks = JSXSlack(block);

    const msgOptions: ChatPostMessageArguments[] = this.channels.map(
      (channel) => {
        return {
          channel,
          text,
          username: user.name,
          icon_url: user.avatarURL,
          unfurl_links: true,
          blocks: translatedBlocks,
        };
      }
    );

    console.dir({ msgOptions }, { depth: null });

    try {
      await Promise.all(
        msgOptions.map(async (option) => this.client.chat.postMessage(option))
      );
    } catch (e) {
      if (e instanceof Error) throw e;
    }
  }
}
