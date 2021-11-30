import { Context } from "jsx-slack";
import { PropertyValueMultiSelect } from "~/@types/notion-api-types";

interface MultiSelectPropertyProps {
  key: string;
  property: PropertyValueMultiSelect;
}

export const MultiSelectProperty = ({
  key,
  property,
}: MultiSelectPropertyProps) => {
  return (
    <>
      <p>
        <b>{key}</b>: {property.multi_select.map((v) => v.name).join(", ")}
      </p>
    </>
  );
};
