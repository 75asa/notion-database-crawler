import {
  PropertyValue,
  PropertyValuePeople,
  PropertyValueUserPersonOrBot,
} from "~/@types/notion-api-types";
import { UserBlock } from "~/model/valueObject";
import { ValueObject } from "~/model/valueObject/ValueObject";
import { isDetectiveType, extractUserOrBotFromPeoples } from "~/utils";

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
