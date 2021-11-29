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
      <Context>
        <p>
          <b>{key}</b>
        </p>
        : {property.multi_select.map((v) => v.name).join(", ")}
      </Context>
    </>
  );
};
