import { Context } from "jsx-slack";
import { PropertyValueDate } from "~/@types/notion-api-types";

interface DatePropertyProps {
  key: string;
  property: PropertyValueDate;
}

export const DateProperty = ({ key, property }: DatePropertyProps) => {
  return (
    <>
      <Context>
        <p>
          <b>{key}</b>
        </p>
        : {property.date?.start ?? ""}
      </Context>
    </>
  );
};
