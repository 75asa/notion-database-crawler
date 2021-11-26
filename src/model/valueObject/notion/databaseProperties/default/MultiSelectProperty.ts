import { PrimitiveValueObject } from "../../..";
import { PropertyValueMultiSelect } from "../../../../../@types/notion-api-types";
import { isDetectiveType } from "../../../../../utils";
import { BasePropertyProps, BasePropertyFactoryArgs } from "./BaseProperty";

interface MultiSelectPropertyProps
  extends BasePropertyProps<PropertyValueMultiSelect> {
  optionNames: string[];
}

export class MultiSelectProperty extends PrimitiveValueObject<MultiSelectPropertyProps> {
  static create({
    key,
    propValue,
  }: BasePropertyFactoryArgs): MultiSelectProperty {
    if (!isDetectiveType<PropertyValueMultiSelect>(propValue)) {
      throw new Error(
        `Invalid URLProperty propValue: ${JSON.stringify(propValue)}`
      );
    }
    const optionNames = propValue.multi_select
      .map((item) => {
        if (item.name) return item.name as string;
      })
      .filter(
        (item): item is Exclude<typeof item, undefined> => item !== undefined
      );
    return new MultiSelectProperty({
      key,
      value: propValue,
      optionNames,
    });
  }
}
