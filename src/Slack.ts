import { ChatPostMessageArguments, WebClient } from '@slack/web-api'
import JSXSlack from 'jsx-slack'
import { Header } from './blocks/Header'
import { Config } from './Config'
import { Page } from './model/entity/Page'
import { User } from './model/entity/User'

export class Slack {
  private client
  constructor() {
    this.client = this.init()
  }

  private init() {
    return new WebClient(Config.Slack.BOT_TOKEN)
  }

  async postMessage(arg: { page: Page; databaseName: string; user: User }) {
    const { databaseName, page, user } = arg
    const text = `${databaseName} に新しいページ: <${page.url}|${page.name}> が投稿されました`
    const msgOption: ChatPostMessageArguments = {
      channel: Config.Slack.CHANNEL_NAME,
      text,
      username: user.name,
      icon_url: user.avatarURL,
      unfurl_links: true,
      blocks: JSXSlack(Header(databaseName!, page)),
    }

    console.dir({ msgOption }, { depth: null })

    try {
      await this.client.chat.postMessage(msgOption)
    } catch (e) {
      throw e
    }
  }
}
