import { PropertyValueEmail } from "~/@types/notion-api-types";

interface EmailPropertyProps {
  key: string;
  property: PropertyValueEmail;
}

export const EmailProperty = ({ key, property }: EmailPropertyProps) => {
  return (
    <>
      <p>
        <b>{key}</b>: {property.email ?? ""}
      </p>
    </>
  );
};
