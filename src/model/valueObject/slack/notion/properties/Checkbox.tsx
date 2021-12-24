import { PropertyValueCheckbox } from "~/@types/notion-api-types";

interface CheckboxPropertyProps {
  key: string;
  property: PropertyValueCheckbox;
}

export const CheckboxProperty = ({ key, property }: CheckboxPropertyProps) => {
  return (
    <>
      <p>
        <b>{key}</b>: {property.checkbox.valueOf() ? "✅" : "□"}
      </p>
    </>
  );
};
