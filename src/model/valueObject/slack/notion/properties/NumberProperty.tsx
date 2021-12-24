import { PropertyValueNumber } from "~/@types/notion-api-types";

interface NumberPropertyProps {
  key: string;
  property: PropertyValueNumber;
}

export const NumberProperty = ({ key, property }: NumberPropertyProps) => {
  return (
    <>
      <p>
        <b>{key}</b>: {property.number ?? 0}
      </p>
    </>
  );
};
