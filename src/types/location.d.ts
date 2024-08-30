import { CountryCode } from "./enums";

export type Location = {
  isLoading: boolean;
  searchCountry: CountryCode | undefined;
  searchCity: string | undefined;
};
