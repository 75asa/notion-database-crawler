import { PropertyValue } from "~/@types/notion-api-types";

export interface BasePropertyFactoryArgs {
  key: string;
  value: PropertyValue;
}

export interface BasePropertyProps<T extends PropertyValue> {
  key: string;
  value: T;
}
