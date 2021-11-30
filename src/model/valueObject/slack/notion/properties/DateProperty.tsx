import { Context } from "jsx-slack";
import { PropertyValueDate } from "~/@types/notion-api-types";

interface DatePropertyProps {
  key: string;
  property: PropertyValueDate;
}

export const DateProperty = ({ key, property }: DatePropertyProps) => {
  return (
    <>
      <p>
        <b>{key}</b>: {property.date?.start ?? ""}
      </p>
    </>
  );
};
