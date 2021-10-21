import {
  PropertyValue,
  MultiSelectPropertyValue,
} from "@notionhq/client/build/src/api-types";
import { isDetectiveType } from "../../../../utils";
import { PrimitiveValueObject } from "../../PrimitiveValueObject";
export class MultiSelect extends PrimitiveValueObject<string[]> {
  static create(propValue: PropertyValue): MultiSelect {
    if (!isDetectiveType<MultiSelectPropertyValue>(propValue)) {
      throw new Error(
        `Invalid URLProperty propValue: ${JSON.stringify(propValue)}`
      );
    }
    const optionsNames = propValue.multi_select
      .map((item) => {
        if (item.name) return item.name as string;
      })
      .filter(
        (item): item is Exclude<typeof item, undefined> => item !== undefined
      );
    return new MultiSelect(optionsNames);
  }
}
