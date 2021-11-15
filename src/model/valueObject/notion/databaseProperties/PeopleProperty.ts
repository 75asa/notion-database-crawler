import {
  PropertyValue,
  PropertyValuePeople,
  PropertyValueUserPersonOrBot,
} from "../../../../@types/notion-api-types";
import {
  extractUserOrBotFromPeoples,
  isDetectiveType,
} from "../../../../utils";
import { ValueObject } from "../../ValueObject";
import { UserBlock } from "../blocks/UserBlock";

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
