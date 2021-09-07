import dotenv from 'dotenv'

const config = dotenv.config().parsed

if (config) {
  for (const key in config) {
    process.env[key] = config[key]
  }
}
export namespace Config {
  export namespace Slack {
    export const BOT_TOKEN = process.env.SLACK_BOT_TOKEN!
    export const CHANNEL_NAME = process.env.CHANNEL_NAME!
  }
  export namespace Notion {
    export const KEY = process.env.NOTION_KEY!
    export const CREATED_AT_PROP_NAME =
      process.env.NOTION_CREATED_AT_PROP_NAME || 'CreatedAt'
    export const LAST_EDITED_BY_PROP_NAME =
      process.env.NOTION_LAST_EDITED_BY_PROP_NAME || 'LastEditedBy'
  }
  export const JOB_INTERVAL_SECONDS =
    Number(process.env.JOB_INTERVAL_SECONDS) || 60
}
