// src/components/AddressForm.tsx
import React from "react";
import { AddressElement } from "@stripe/react-stripe-js";
import { Address } from "../../types/user";
import { CountryCode } from "../../types/enums";

interface AddressFormProps {
  address: {
    city?: string;
    country: string;
    postal_code?: string;
    line1?: string;
  };
  onAddressChange?: (address: Address) => void;
}

export const AddressForm: React.FC<AddressFormProps> = ({
  address,
  onAddressChange,
}) => {
  const handleAddressChange = (event: any) => {
    if (!onAddressChange) return;
    const { city, country, postal_code, line1 } = event.value.address;
    onAddressChange({
      city,
      country,
      zipCode: postal_code,
      street: line1,
    });
  };

  return (
    <div>
      <AddressElement
        onChange={(event) => handleAddressChange(event)}
        options={{
          mode: "billing",
          defaultValues: { address },
          allowedCountries: Object.values(CountryCode).map((code) =>
            code.toUpperCase(),
          ),
        }}
      />
    </div>
  );
};
