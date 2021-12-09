import { PropertyValueUrl } from "~/@types/notion-api-types";

interface UrlPropertyProps {
  key: string;
  property: PropertyValueUrl;
}

export const UrlProperty = ({ key, property }: UrlPropertyProps) => {
  return (
    <>
      <p>
        <b>{key}</b>: {property.url ?? ""}
      </p>
    </>
  );
};
