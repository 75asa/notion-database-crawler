/// <reference types="node" />

declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: "development" | "production" | "test";
    readonly PUBLIC_URL: string;
    readonly BOT_TOKEN: string;
    readonly CHANNEL_NAME: string;
    readonly NOTION_KEY: string
  }
}
