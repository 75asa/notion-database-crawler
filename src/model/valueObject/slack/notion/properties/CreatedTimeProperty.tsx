import { PropertyValueCreatedTime } from "~/@types/notion-api-types";
import { parseDate } from "~/utils";

interface CreatedTimePropertyProps {
  key: string;
  property: PropertyValueCreatedTime;
}

export const CreatedTimeProperty = ({
  key,
  property,
}: CreatedTimePropertyProps) => {
  return (
    <>
      <p>
        <b>{key}</b>: {parseDate(property.created_time)}
      </p>
    </>
  );
};
