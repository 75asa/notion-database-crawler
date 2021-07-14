import {
  PropertyValue,
  TitlePropertyValue,
} from "@notionhq/client/build/src/api-types";
import dayjs from "dayjs";

export const isTitlePropertyValue = (
  propValue: PropertyValue
): propValue is TitlePropertyValue => {
  return (propValue as TitlePropertyValue).type === "title";
};

export const parseISO8601 = (date: Date) => {
  return dayjs(date).format();
};

export const parseDate = (isoString: string) => {
  return dayjs(isoString).toDate();
};
