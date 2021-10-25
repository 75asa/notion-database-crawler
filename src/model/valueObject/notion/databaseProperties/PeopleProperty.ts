import {
  PeoplePropertyValue,
  PropertyValue,
} from "@notionhq/client/build/src/api-types";
import { isDetectiveType } from "../../../../utils";
import { ValueObject } from "../../ValueObject";
import { UserBlock } from "../blocks/UserBlock";

export class PeopleProperty extends ValueObject<UserBlock[]> {
  static create(propValue: PropertyValue): PeopleProperty {
    if (!isDetectiveType<PeoplePropertyValue>(propValue)) {
      throw new Error(
        `Invalid PeoplePropertyValue: ${JSON.stringify(propValue)}`
      );
    }
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
