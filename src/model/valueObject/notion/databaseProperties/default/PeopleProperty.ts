import { UserBlock } from "../..";
import {
  PropertyValue,
  PropertyValuePeople,
  PropertyValueUserPersonOrBot,
} from "../../../../../@types/notion-api-types";
import {
  isDetectiveType,
  extractUserOrBotFromPeoples,
} from "../../../../../utils";
import { ValueObject } from "../../../ValueObject";

export class PeopleProperty extends ValueObject<UserBlock[]> {
  static create(propValue: PropertyValue): PeopleProperty {
    if (!isDetectiveType<PropertyValuePeople>(propValue)) {
      throw new Error(
        `Invalid PeoplePropertyValue: ${JSON.stringify(propValue)}`
      );
    }
    const peoples = extractUserOrBotFromPeoples(propValue.people);

    const peopleList = peoples.map((people: PropertyValueUserPersonOrBot) => {
      return UserBlock.create(people);
    });
    return new PeopleProperty(peopleList);
  }
}
