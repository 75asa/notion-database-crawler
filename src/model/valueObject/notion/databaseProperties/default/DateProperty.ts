import { PropertyValueDate } from "../../../../../@types/notion-api-types";
import { isDetectiveType, parseDate } from "../../../../../utils";
import { ValueObject } from "../../../ValueObject";
import { BasePropertyFactoryArgs, BasePropertyProps } from "./BaseProperty";

interface DatePropertyProps extends BasePropertyProps<PropertyValueDate> {
  date: Date;
}

export class DateProperty extends ValueObject<DatePropertyProps> {
  static create({ key, propValue }: BasePropertyFactoryArgs): DateProperty {
    if (!isDetectiveType<PropertyValueDate>(propValue)) {
      throw new Error(
        `Invalid DateProperty propValue: ${JSON.stringify(propValue)}`
      );
    }
    const term = propValue.date;
    if (!term) throw new Error("Invalid SelectProperty propValue");
    return new DateProperty({
      key,
      value: propValue,
      date: parseDate(term.start),
    });
  }
  // hoge() {
  //   this.props['']
  // }
}
