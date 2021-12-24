import { PropertyValueEditedTime } from "~/@types/notion-api-types";
import { parseDate } from "~/utils";

interface LastEditedTimePropertyProps {
  key: string;
  property: PropertyValueEditedTime;
}

export const LastEditedTimeProperty = ({
  key,
  property,
}: LastEditedTimePropertyProps) => {
  return (
    <>
      <p>
        <b>{key}</b>: {parseDate(property.last_edited_time)}
      </p>
    </>
  );
};
