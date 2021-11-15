import {
  PeopleValue,
  PropertyValue,
  PropertyValueUserBot,
  PropertyValueUserPerson,
  RichText,
} from "../@types/notion-api-types";

export const getName = (titleList: RichText[]) => {
  return titleList.reduce((acc, cur) => {
    if (!("plain_text" in cur)) return acc;
    return (acc += (acc.length ? " " : "") + cur.plain_text);
  }, "");
};

export const isDetectiveType = <T extends PropertyValue>(
  propValue: PropertyValue
): propValue is T => {
  const propertyType = (propValue as T).type;
  return (propValue as T).type === propertyType;
};

export const extractUserOrBotFromPeoples = (peopleValues: PeopleValue) => {
  return peopleValues
    .map((people) => {
      if ("type" in people) {
        return people as PropertyValueUserPerson | PropertyValueUserBot;
      }
    })
    .filter(
      (item): item is Exclude<typeof item, undefined> => item !== undefined
    );
};
