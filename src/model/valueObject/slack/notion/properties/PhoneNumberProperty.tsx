import { PropertyValuePhoneNumber } from "~/@types/notion-api-types";

interface PhoneNumberPropertyProps {
  key: string;
  property: PropertyValuePhoneNumber;
}

export const PhoneNumberProperty = ({
  key,
  property,
}: PhoneNumberPropertyProps) => {
  return (
    <>
      <p>
        <b>{key}</b>: {property.phone_number ?? ""}
      </p>
    </>
  );
};
