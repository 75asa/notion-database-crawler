import {
  DateProperty,
  MultiSelectProperty,
  PeopleProperty,
  SelectProperty,
  TextProperty,
  TitleProperty,
  URLProperty,
} from ".";

export type VisiblePropsTypes =
  | PeopleProperty
  | URLProperty
  | DateProperty
  | TextProperty
  | TitleProperty
  | MultiSelectProperty
  | SelectProperty;

export * from "./DateProperty";
export * from "./MultiSelectProperty";
export * from "./TitleProperty";
export * from "./NumberProperty";
export * from "./PeopleProperty";
export * from "./SelectProperty";
export * from "./TextProperty";
export * from "./URLProperty";
