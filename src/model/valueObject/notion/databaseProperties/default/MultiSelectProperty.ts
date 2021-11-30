import { PropertyValueMultiSelect } from "~/@types/notion-api-types";
import {
  BasePropertyProps,
  BasePropertyFactoryArgs,
} from "~/model/valueObject/notion/databaseProperties/default/BaseProperty";
import { PrimitiveValueObject } from "~/model/valueObject/PrimitiveValueObject";
import { isDetectiveType } from "~/utils";

interface MultiSelectPropertyProps
  extends BasePropertyProps<PropertyValueMultiSelect> {
  optionNames: string[];
}

export class MultiSelectProperty extends PrimitiveValueObject<MultiSelectPropertyProps> {
  static create({ key, value }: BasePropertyFactoryArgs): MultiSelectProperty {
    if (!isDetectiveType<PropertyValueMultiSelect>(value)) {
      throw new Error(
        `Invalid URLProperty propValue: ${JSON.stringify(value)}`
      );
    }
    const optionNames = value.multi_select
      .map((item) => {
        if (item.name) return item.name as string;
      })
      .filter(
        (item): item is Exclude<typeof item, undefined> => item !== undefined
      );
    return new MultiSelectProperty({
      key,
      value: value,
      optionNames,
    });
  }
}
