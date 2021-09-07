import { Page as NotionPage } from '@notionhq/client/build/src/api-types'
import { PrimitiveValueObject } from './PrimitiveValueObject'

export class DatabaseId extends PrimitiveValueObject<string> {
  static create(prop: NotionPage): DatabaseId {
    if (prop.parent.type !== 'database_id') {
      throw new Error('DatabaseId.create: parent must be a database_id')
    }
    return new DatabaseId(prop.parent.database_id)
  }
}
