import { PropertyValueSelect } from "~/@types/notion-api-types";

interface SelectPropertyProps {
  key: string;
  property: PropertyValueSelect;
}

export const SelectProperty = ({ key, property }: SelectPropertyProps) => {
  return (
    <>
      <p>
        <b>{key}</b>: {property.select?.name ?? ""}
      </p>
    </>
  );
};
