import { PropertyValueSelect } from "~/@types/notion-api-types";
import {
  BasePropertyProps,
  BasePropertyFactoryArgs,
} from "~/model/valueObject/notion/databaseProperties/default/BaseProperty";
import { ValueObject } from "~/model/valueObject/ValueObject";
import { isDetectiveType } from "~/utils";

interface SelectPropertyProps extends BasePropertyProps<PropertyValueSelect> {
  option: string | undefined;
}

export class SelectProperty extends ValueObject<SelectPropertyProps> {
  static create({ key, value }: BasePropertyFactoryArgs): SelectProperty {
    if (!isDetectiveType<PropertyValueSelect>(value)) {
      throw new Error(
        `Invalid SelectProperty propValue: ${JSON.stringify(value)}`
      );
    }
    const optionName = value.select?.name;
    return new SelectProperty({ key, value: value, option: optionName });
  }
}
