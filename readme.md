# notion-database-crawler

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/75asa/notion-database-crawler/tree/main)

# What is this ?

This is Notion Database crawler.
if found new page, notify slack channel !

# How to use ?

1. create new app from manifest file;
1. paste this `manifest.yml` and install workspace
1. add slack app your channel
1. go to [Developers・Beta: Getting start](https://developers.notion.com/docs/getting-started)
1. create integration
1. invite integration to a database page you wanna watch
1. click Heroku deploy button at tha top
1. enter required config values
1. go to api.slack.com FYI: https://api.slack.com/apps

  <img src="https://i.gyazo.com/2bb49734436380d35d3dbe07ad8f0b90.png" height="400" width="400">

# Note
- You can choose multiple Slack channels to notify a new post. if you wanna, set  `SLACK_CHANNEL_NAMES` like `[general, notifications]`
- If you wanna display some Notion page properties, you can set `NOTION_VISIBLE_PROPS` like `[title,description,created_time,updated_time]`

[![Image from Gyazo](https://i.gyazo.com/fddf34585969655be8827347c3e796a8.gif)](https://gyazo.com/fddf34585969655be8827347c3e796a8)

# How to use Docker

## commands

- `$ docker compose up -d`
- `$ docker compose down -v`
- `$ docker compose ps`

# How to backup on Postgres

- `$ heroku pg:backups:capture --remote heroku-prd`
- `$ curl -o latest.dump (shell heroku pg:backups public-url --remote heroku-prd)`
- `$ docker exec -i postgres-notion-database-crawler pg_restore --verbose --clean -U notion --no-acl --no-owner -d notion < latest.dump`


# ⚠️ Caution

Notion API is still [beta]
Currently using [v0.4.9](https://github.com/makenotion/notion-sdk-js/releases/tag/v0.4.9)
