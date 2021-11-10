import {
  PropertyValue,
  PropertyValuePeople,
} from "../../../../@types/notion-api-types";
import { isDetectiveType } from "../../../../utils";
import { ValueObject } from "../../ValueObject";
import { UserBlock } from "../blocks/UserBlock";

export class PeopleProperty extends ValueObject<UserBlock[]> {
  static create(propValue: PropertyValue): PeopleProperty {
    if (!isDetectiveType<PropertyValuePeople>(propValue)) {
      throw new Error(
        `Invalid PeoplePropertyValue: ${JSON.stringify(propValue)}`
      );
    }
    if (!("type" in propValue))
      throw new Error(
        `Invalid PeoplePropertyValue: ${JSON.stringify(propValue)}`
      );
    const { people } = propValue;

    const peopleList = people
      .map((item) => {
        return UserBlock.create(item);
      })
      .filter(
        (item): item is Exclude<typeof item, undefined> => item !== undefined
      );
    return new PeopleProperty(peopleList);
  }
}
