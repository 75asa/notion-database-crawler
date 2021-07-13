import {
  ChatPostMessageArguments,
  KnownBlock,
  WebClient,
} from "@slack/web-api";

export const sendMessage = async (
  msg: string,
  client: WebClient,
  blocks: KnownBlock[]
) => {
  const msgOption: ChatPostMessageArguments = {
    channel: process.env.CHANNEL_NAME!,
    text: msg,
    blocks,
  };
  await client.chat.postMessage(msgOption);
};
