import { Context } from "jsx-slack";
import { PropertyValueSelect } from "~/@types/notion-api-types";

interface SelectPropertyProps {
  key: string;
  property: PropertyValueSelect;
}

export const SelectProperty = ({ key, property }: SelectPropertyProps) => {
  return (
    <>
      <Context>
        <p>
          <b>{key}</b>
        </p>
        : {property.select?.name ?? ""}
      </Context>
    </>
  );
};
