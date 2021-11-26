import {
  PropertyValue,
  PropertyValueMap,
} from "../../../../@types/notion-api-types";
import { ValueObject } from "../../ValueObject";

export interface RawPropertiesProps {
  propName: string;
  propValue: PropertyValue;
}

export class RawProperties extends ValueObject<RawPropertiesProps[]> {
  static create(propValues: PropertyValueMap): RawProperties {
    const rawProps = [];
    for (const propName in propValues) {
      const propValue = propValues[propName];
      rawProps.push({ propName, propValue });
    }
    return new RawProperties(rawProps);
  }
}
