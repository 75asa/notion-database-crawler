import {
  RichText,
  PropertyValue,
  PeopleValue,
  PropertyValueUserPerson,
  PropertyValueUserBot,
} from "~/@types/notion-api-types";

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

export const isPropertyValue = (input: unknown): input is PropertyValue => {
  return (
    input instanceof Object &&
    Object.keys(input).length === 1 &&
    "value" in input &&
    "type" in input
  );
};

export const isKeyValueObject = (
  input: unknown
): input is { [key: string]: unknown } => {
  return input instanceof Object && Object.keys(input).length === 1;
};
