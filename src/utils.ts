import {
  LastEditedByPropertyValue,
  PropertyValue,
  TitleInputPropertyValue,
  TitlePropertyValue,
} from "@notionhq/client/build/src/api-types";
import dayjs from "dayjs";

export const isTitlePropertyValue = (
  propValue: PropertyValue
): propValue is TitlePropertyValue => {
  // TODO: propValue.title === RichText[] も入れたい
  return (propValue as TitlePropertyValue).type === "title";
};

// export const isTitleInputPropertyValue = (
//   propValue: PropertyValue
// ): propValue is TitleInputPropertyValue => {
//   return (
//     (propValue as TitleInputPropertyValue).type === "title" &&
//     // TODO: こうしたい
//     (propValue as TitleInputPropertyValue).title === RichTextInput[]
//   );
// };

export const isLastEditedByPropertyValue = (
  propValue: PropertyValue
): propValue is LastEditedByPropertyValue => {
  return (propValue as LastEditedByPropertyValue).type === "last_edited_by";
};

export const parseISO8601 = (date: Date) => {
  return dayjs(date).format();
};

export const parseDate = (isoString: string) => {
  return dayjs(isoString).toDate();
};
