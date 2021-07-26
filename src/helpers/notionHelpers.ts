import {
  LastEditedByPropertyValue,
  PropertyValue,
  RichText,
  TitlePropertyValue,
} from "@notionhq/client/build/src/api-types";

export const isTitlePropertyValue = (
  propVal: PropertyValue
): propVal is TitlePropertyValue => {
  // TODO: propValue.title === RichText[] も入れたい
  return (propVal as TitlePropertyValue).type === "title";
};

export const isLastEditedByPropertyValue = (
  propVal: PropertyValue
): propVal is LastEditedByPropertyValue => {
  return (propVal as LastEditedByPropertyValue).type === "last_edited_by";
};

// private isTitleInputPropertyValue = (
//   propValue: PropertyValue
// ): propValue is TitleInputPropertyValue => {
//   return (
//     (propValue as TitleInputPropertyValue).type === "title" &&
//     // TODO: こうしたい
//     (propValue as TitleInputPropertyValue).title === RichTextInput[]
//   );
// };

export const getName = (titleList: RichText[]) => {
  return titleList.reduce((acc, cur) => {
    if (!("plain_text" in cur)) return acc;
    return (acc += ` ${cur.plain_text}`);
  }, "");
};
