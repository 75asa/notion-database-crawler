import { PropertyValue, PropertyValueMap } from "../../../@types/notion-api-types";
import { ValueObject } from "../ValueObject";

export class RawProperties extends ValueObject<PropertyValue[]> {
  static create(propValues: PropertyValueMap): RawProperties {
    const rawProps: PropertyValue[] = [];
    for (const propName in propValues) {
      const propValue = propValues[propName];
      rawProps.push(propValue);
    }
    return new RawProperties(rawProps);
  }
}
