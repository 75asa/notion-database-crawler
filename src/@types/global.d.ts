/// <reference types="node" />

declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: "development" | "production" | "test";
    readonly PUBLIC_URL: string;
    readonly SLACK_BOT_TOKEN: string;
    readonly SLACK_CHANNEL_NAME: string;
    readonly NOTION_KEY: string
  }
}
