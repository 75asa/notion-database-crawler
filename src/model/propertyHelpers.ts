import { RichText } from '@notionhq/client/build/src/api-types'

export const getName = (titleList: RichText[]) => {
  return titleList.reduce((acc, cur) => {
    if (!('plain_text' in cur)) return acc
    return (acc += (acc.length ? ' ' : '') + cur.plain_text)
  }, '')
}
