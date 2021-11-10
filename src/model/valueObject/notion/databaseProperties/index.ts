import {
  DateProperty,
  MultiSelectProperty,
  PeopleProperty,
  SelectProperty,
  TextProperty,
  TitleProperty,
  URLProperty,
} from ".";

export type VisibleProps =
  | typeof PeopleProperty
  | typeof DateProperty
  | typeof TextProperty
  | typeof TitleProperty
  | typeof MultiSelectProperty
  | typeof SelectProperty
  | typeof URLProperty;

export * from "./DateProperty";
export * from "./MultiSelectProperty";
export * from "./TitleProperty";
export * from "./NumberProperty";
export * from "./PeopleProperty";
export * from "./SelectProperty";
export * from "./TextProperty";
export * from "./URLProperty";
