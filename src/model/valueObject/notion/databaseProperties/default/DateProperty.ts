import { PropertyValueDate } from "~/@types/notion-api-types";
import {
  BasePropertyProps,
  BasePropertyFactoryArgs,
} from "~/model/valueObject/notion/databaseProperties/default/BaseProperty";
import { ValueObject } from "~/model/valueObject/ValueObject";
import { isDetectiveType, parseDate } from "~/utils";

interface DatePropertyProps extends BasePropertyProps<PropertyValueDate> {
  date: Date;
}

export class DateProperty extends ValueObject<DatePropertyProps> {
  static create({ key, value }: BasePropertyFactoryArgs): DateProperty {
    if (!isDetectiveType<PropertyValueDate>(value)) {
      throw new Error(
        `Invalid DateProperty propValue: ${JSON.stringify(value)}`
      );
    }
    const term = value.date;
    if (!term) throw new Error("Invalid SelectProperty propValue");
    return new DateProperty({
      key,
      value,
      date: parseDate(term.start),
    });
  }
}
