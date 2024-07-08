import { CountryCode } from "./enums";

export type CountryType = {
  code: CountryCode;
  label: string;
  phone: string;
  currency: Currency; // Add currency field
  suggested?: boolean;
};
