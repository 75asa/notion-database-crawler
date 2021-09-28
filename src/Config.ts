import dotenv from "dotenv";

const config = dotenv.config().parsed;

if (config) {
  for (const key in config) {
    process.env[key] = config[key];
  }
}

export namespace Config {
  export namespace Slack {
    export const BOT_TOKEN = process.env.SLACK_BOT_TOKEN;
    export const CHANNEL_NAME = process.env.SLACK_CHANNEL_NAME;
  }
  export namespace Notion {
    export const KEY = process.env.NOTION_KEY;
    export const IGNORE_PREFIX = process.env.IGNORE_PREFIX || "Copy of";
    export namespace Props {
      export const CREATED_AT =
        process.env.NOTION_CREATED_AT_PROP_NAME || "CreatedAt";
      export const LAST_EDITED_BY =
        process.env.NOTION_LAST_EDITED_BY_PROP_NAME || "LastEditedBy";
      export const IS_PUBLISHED =
        process.env.NOTION_IS_PUBLISHED || "IsPublished";
      export const NAME = process.env.NOTION_NAME || "Name";
    }
    export const MUST_EXIST_PROPS = Object.keys(Props).map(
      key => Props[key as keyof typeof Props] as keyof typeof Props
    );
  }
  export const JOB_INTERVAL_SECONDS =
    Number(process.env.JOB_INTERVAL_SECONDS) || 60;
}
