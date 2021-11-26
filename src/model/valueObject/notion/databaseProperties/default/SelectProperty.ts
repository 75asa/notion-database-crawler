import { PropertyValueSelect } from "../../../../../@types/notion-api-types";
import { isDetectiveType } from "../../../../../utils";
import { ValueObject } from "../../../ValueObject";
import { BasePropertyFactoryArgs, BasePropertyProps } from "./BaseProperty";

interface SelectPropertyProps extends BasePropertyProps<PropertyValueSelect> {
  option: string | undefined;
}

export class SelectProperty extends ValueObject<SelectPropertyProps> {
  static create({ key, propValue }: BasePropertyFactoryArgs): SelectProperty {
    if (!isDetectiveType<PropertyValueSelect>(propValue)) {
      throw new Error(
        `Invalid SelectProperty propValue: ${JSON.stringify(propValue)}`
      );
    }
    const optionName = propValue.select?.name;
    return new SelectProperty({ key, value: propValue, option: optionName });
  }
}
