import {
  PropertyValue,
  PropertyValueDate,
} from "../../../../@types/notion-api-types";
import { isDetectiveType, parseDate } from "../../../../utils";
import { PrimitiveValueObject } from "../../PrimitiveValueObject";

export class DateProperty extends PrimitiveValueObject<Date> {
  static create(propValue: PropertyValue): DateProperty {
    if (!isDetectiveType<PropertyValueDate>(propValue)) {
      throw new Error(
        `Invalid DateProperty propValue: ${JSON.stringify(propValue)}`
      );
    }
    const term = propValue.date;
    if (!term) throw new Error("Invalid SelectProperty propValue");
    return new DateProperty(parseDate(term.start));
  }
}
