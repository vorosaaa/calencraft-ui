import { Autocomplete, Box, Button, Stack, TextField } from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import { SearchContainer } from "./css/ProviderList.css";
import { ProviderTable } from "./ProviderTable";
import { useQuery } from "react-query";
import { View } from "../login/Login.css";
import { GridPaginationModel } from "@mui/x-data-grid";
import { useTranslation } from "react-i18next";
import { ServiceCategory, CountryCode } from "../../types/enums";
import { useCheckMobileScreen } from "../../hooks/screenHook";
import { countries } from "../../types/countries";
import { useLocation } from "../../hooks/locationHook";
import { getProviders } from "../../api/providerApi";

export const SearchPage = () => {
  const isMobile = useCheckMobileScreen();
  const {
    isLoading: isLocationLoading,
    searchCountry,
    setSearchCountry,
  } = useLocation();

  const [searchName, setSearchName] = useState<string | undefined>();
  const [searchCity, setSearchCity] = useState<string | undefined>();
  const [searchCategory, setSearchCategory] = useState<string | undefined>();
  const [country, setCountry] = useState<CountryCode>();

  useEffect(() => {
    setCountry(searchCountry);
  }, [searchCountry]);

  const [paginationDetails, setPaginationDetails] = useState({
    page: 0,
    pageSize: 10,
  });
  const [searchObject, setSearchObject] = useState<{
    name?: string;
    city?: string;
    category?: string;
  }>({});
  const { data, isLoading } = useQuery(
    ["providers", searchObject, searchCountry, paginationDetails],
    () =>
      getProviders(
        paginationDetails.page,
        paginationDetails.pageSize,
        searchObject.name,
        searchObject.city,
        searchCountry,
        searchObject.category,
      ),
  );

  const handleSearchSubmit = () => {
    setPaginationDetails({ ...paginationDetails, page: 0 });
    setSearchCountry(country);
    setSearchObject({
      name: searchName?.length === 0 ? undefined : searchName,
      city: searchCity?.length === 0 ? undefined : searchCity,
      category: searchCategory,
    });
  };

  const onPaginationChange = (model: GridPaginationModel) => {
    setPaginationDetails(model);
  };
  return (
    <View maxWidth="lg" sx={{ pt: 4 }}>
      <SearchContainer>
        <Stack
          direction={isMobile ? "column" : "row"}
          spacing={2}
          sx={{ width: "100%" }}
        >
          <SearchForm
            searchName={searchName}
            setSearchName={setSearchName}
            searchCity={searchCity}
            setSearchCity={setSearchCity}
            searchCategory={searchCategory}
            setSearchCategory={setSearchCategory}
            searchCountry={country}
            setSearchCountry={setCountry}
            handleSearchSubmit={handleSearchSubmit}
          />
        </Stack>
      </SearchContainer>
      <ProviderTable
        providers={data?.resultList || []}
        total={data?.total || 0}
        isLoading={isLoading || isLocationLoading}
        paginationModel={paginationDetails}
        onPaginationChange={onPaginationChange}
      />
    </View>
  );
};

type SearchProps = {
  searchName?: string;
  searchCity?: string;
  searchCategory?: string;
  searchCountry?: CountryCode;
  setSearchName: (e: string) => void;
  setSearchCity: (e: string) => void;
  setSearchCountry: (v: CountryCode | undefined) => void;
  setSearchCategory: (e: string | undefined) => void;
  handleSearchSubmit: () => void;
};

const SearchForm = ({
  searchName,
  setSearchName,
  searchCity,
  setSearchCity,
  searchCategory,
  setSearchCategory,
  searchCountry,
  setSearchCountry,
  handleSearchSubmit,
}: SearchProps) => {
  const { t } = useTranslation();
  const isMobile = useCheckMobileScreen();
  return (
    <Fragment>
      <TextField
        fullWidth={!isMobile}
        label={t("search.header.name")}
        variant="outlined"
        value={searchName}
        onChange={(e) => setSearchName(e.target.value)}
      />
      <TextField
        fullWidth={!isMobile}
        label={t("search.header.city")}
        variant="outlined"
        value={searchCity}
        onChange={(e) => setSearchCity(e.target.value)}
      />
      <Autocomplete
        fullWidth
        id="service-type"
        options={Object.values(ServiceCategory)}
        getOptionLabel={(option) => t(`service_types.${option}`)}
        value={searchCategory}
        onChange={(event, newValue) => setSearchCategory(newValue || undefined)}
        renderInput={(params) => (
          <TextField
            {...params}
            label={t("search.header.type")}
            variant="outlined"
          />
        )}
      />
      <Autocomplete
        fullWidth
        value={
          countries.find((country) => country.code === searchCountry) || null
        }
        autoHighlight
        onChange={(_event, newValue) => setSearchCountry(newValue?.code)}
        options={countries}
        getOptionLabel={(option) => t(`countries.${option.code}`)}
        renderOption={(props, option) => (
          <Box
            component="li"
            sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
            {...props}
          >
            <img
              loading="lazy"
              width="20"
              srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
              src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
              alt=""
            />
            {t(`countries.${option.code}`) || option.label}
          </Box>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            fullWidth
            label={t("editor.country")}
            inputProps={{ ...params.inputProps }}
          />
        )}
      />
      <Button
        fullWidth
        variant="contained"
        color="primary"
        onClick={handleSearchSubmit}
      >
        {t("search.header.search")}
      </Button>
    </Fragment>
  );
};
