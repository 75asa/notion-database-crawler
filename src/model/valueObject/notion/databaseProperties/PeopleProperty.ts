import {
  PeoplePropertyValue,
  User,
  PropertyValue,
} from "@notionhq/client/build/src/api-types";
import { isDetectiveType } from "../../../../utils";
import { ValueObject } from "../../ValueObject";



export class PeopleProperty extends ValueObject<PeoplePropertyProps[]> {
  static create(propValue: PropertyValue): PeopleProperty {
    if (!isDetectiveType<PeoplePropertyValue>(propValue)) {
      throw new Error(
        `Invalid PeoplePropertyValue: ${JSON.stringify(propValue)}`
      );
    }
    const { people } = propValue;
    const peopleList = people
      .map((item) => {
        const { name, type, avatar_url } = item;
        if (type === "bot") {
          return {
            name: name || "",
            icon: avatar_url || "",
          };
        } else if (type === "person") {
          return {
            name: name || "",
            icon: avatar_url || "",
          };
        }
      })
      .filter(
        (item): item is Exclude<typeof item, undefined> => item !== undefined
      );
    return new PeopleProperty(peopleList);
  }
}
