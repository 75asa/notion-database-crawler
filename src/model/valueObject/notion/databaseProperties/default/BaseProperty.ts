import { PropertyValue } from "../../../../../@types/notion-api-types";

export interface BasePropertyFactoryArgs {
  key: string;
  propValue: PropertyValue;
}

export interface BasePropertyProps<T extends PropertyValue> {
  key: string;
  value: T;
}
