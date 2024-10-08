import { atom, useRecoilState } from "recoil";
import { CountryCode } from "../types/enums";
import { Location } from "../types/location";

const location = atom({
  key: "location",
  default: { isLoading: true } as Location,
});

export const useGeoLocation = () => {
  const [locationState, setLocationState] = useRecoilState(location);

  const setSearchCountry = (value: CountryCode | undefined) =>
    setLocationState((prevState) => ({ ...prevState, searchCountry: value }));

  const setSearchCity = (value: string | undefined) =>
    setLocationState((prevState) => ({ ...prevState, searchCity: value }));

  const setIsLoading = (value: boolean) =>
    setLocationState((prevState) => ({ ...prevState, isLoading: value }));

  return {
    location: locationState,
    isLoading: locationState.isLoading,
    setSearchCity,
    setIsLoading,
    setSearchCountry,
  };
};
