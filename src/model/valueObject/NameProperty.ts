import {
  PropertyValue,
  TitlePropertyValue,
} from '@notionhq/client/build/src/api-types'
import { getName } from '../propertyHelpers'
import { PrimitiveValueObject } from './PrimitiveValueObject'

const isTitlePropertyValue = (
  propValue: PropertyValue
): propValue is TitlePropertyValue => {
  // TODO: propValue.title === RichText[] も入れたい
  return (propValue as TitlePropertyValue).type === 'title'
}

export class NameProperty extends PrimitiveValueObject<string> {
  static create(propValue: PropertyValue): NameProperty {
    if (!isTitlePropertyValue(propValue)) {
      throw new Error(
        `Invalid NameProperty propValue: ${console.dir(propValue)}`
      )
    }
    return new NameProperty(getName(propValue.title))
  }
}
