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
    export const CHANNEL_NAMES = process.env.SLACK_CHANNEL_NAMES
      ? process.env.SLACK_CHANNEL_NAMES.split(",")
      : [];
  }
  export namespace Notion {
    export const KEY = process.env.NOTION_KEY;
    export const IGNORE_KEYWORDS = process.env.NOTION_IGNORE_KEYWORDS
      ? process.env.NOTION_IGNORE_KEYWORDS.split(",")
      : ["Copy of", "のコピー"];
    export namespace Props {
      export const NAME = process.env.NOTION_NAME_PROP || "Name";
      export const CREATED_AT =
        process.env.NOTION_CREATED_AT_PROP || "CreatedAt";
      export const CREATED_BY =
        process.env.NOTION_CREATED_BY_PROP || "CreatedBy";
      export const IS_PUBLISHED =
        process.env.NOTION_IS_PUBLISHED_PROP || "IsPublished";
    }
    export const VISIBLE_PROPS = process.env.NOTION_VISIBLE_PROPS
      ? process.env.NOTION_VISIBLE_PROPS.split(",")
      : [];
    export const MUST_EXIST_PROPS = Object.keys(Props).map(
      (key) => Props[key as keyof typeof Props] as keyof typeof Props
    );
  }
  export namespace Sentry {
    export const DSN = process.env.SENTRY_DSN;
  }
  export const JOB_INTERVAL_SECONDS =
    Number(process.env.JOB_INTERVAL_SECONDS) || 60;
}
