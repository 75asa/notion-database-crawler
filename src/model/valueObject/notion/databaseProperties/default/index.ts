

import { DateProperty } from "./DateProperty";
import { MultiSelectProperty } from "./MultiSelectProperty";
import { TitleProperty } from "./TitleProperty";
import { NumberProperty } from "./NumberProperty";
import { PeopleProperty } from "./PeopleProperty";
import { SelectProperty } from "./SelectProperty";
import { TextProperty } from "./TextProperty";
import { URLProperty } from "./URLProperty";

export * from "./DateProperty";
export * from "./MultiSelectProperty";
export * from "./TitleProperty";
export * from "./NumberProperty";
export * from "./PeopleProperty";
export * from "./SelectProperty";
export * from "./TextProperty";
export * from "./URLProperty";

export type VisiblePropsTypes =
  | DateProperty
  | MultiSelectProperty
  | TitleProperty
  | NumberProperty
  | PeopleProperty
  | SelectProperty
  | TextProperty
  | URLProperty;
