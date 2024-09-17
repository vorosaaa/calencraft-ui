import {
  Autocomplete,
  Box,
  Button,
  Container,
  Grid,
  Skeleton,
  Stack,
  TextField,
} from "@mui/material";
import { Fragment, useState } from "react";
import { SearchContainer } from "./css/ProviderList.css";
import { ProviderTable } from "./ProviderTable";
import { useQuery } from "react-query";
import { GridPaginationModel } from "@mui/x-data-grid";
import { useTranslation } from "react-i18next";
import { ServiceCategory, CountryCode } from "../../types/enums";
import { useCheckMobileScreen } from "../../hooks/screenHook";
import { countries } from "../../types/countries";
import { useGeoLocation } from "../../hooks/locationHook";
import { getProviders } from "../../api/providerApi";

type SearchObject = {
  name?: string;
  city?: string;
  category?: string;
  country?: CountryCode;
};

export const SearchPage = () => {
  const { isLoading: isLocationLoading, location } = useGeoLocation();
  const isMobile = useCheckMobileScreen();
  // States
  const [temporarySearchObject, setTemporarySearchObject] =
    useState<SearchObject>({});
  const [searchObject, setSearchObject] = useState<SearchObject>({});
  const [paginationDetails, setPaginationDetails] = useState({
    page: 0,
    pageSize: 10,
  });

  // Functions
  const updateTemporarySearchObject = (
    key: keyof SearchObject,
    value?: string | CountryCode,
  ) => {
    setTemporarySearchObject((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };
  const onPaginationChange = (model: GridPaginationModel) => {
    setPaginationDetails(model);
  };

  // Queries
  const { data, isLoading } = useQuery(
    ["providers", searchObject, paginationDetails],
    () =>
      getProviders(
        paginationDetails.page,
        paginationDetails.pageSize,
        searchObject.name,
        location.searchCity,
        location.searchCountry,
        searchObject.category,
      ),
    { enabled: !isLocationLoading },
  );

  // Handlers
  const handleSearchSubmit = () => {
    const { category, name } = temporarySearchObject;
    setPaginationDetails({ ...paginationDetails, page: 0 });
    setSearchObject({
      name: name?.length === 0 ? undefined : name,
      city: location.searchCity?.length === 0 ? undefined : location.searchCity,
      country: location.searchCountry,
      category,
    });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 0, pt: 4 }}>
      <SearchContainer>
        <Stack
          direction={isMobile ? "column" : "row"}
          spacing={2}
          sx={{ width: "100%" }}
        >
          {isLocationLoading ? (
            <SearchLoading />
          ) : (
            <SearchForm
              temporarySearchObject={temporarySearchObject}
              updateTemporarySearch={updateTemporarySearchObject}
              handleSearchSubmit={handleSearchSubmit}
            />
          )}
        </Stack>
      </SearchContainer>
      <ProviderTable
        providers={data?.resultList || []}
        total={data?.total || 0}
        isLoading={isLoading || isLocationLoading}
        paginationModel={paginationDetails}
        onPaginationChange={onPaginationChange}
      />
    </Container>
  );
};

type SearchProps = {
  temporarySearchObject: SearchObject;
  updateTemporarySearch: (key: keyof SearchObject, value?: string) => void;

  handleSearchSubmit: () => void;
};

const SearchForm = ({
  temporarySearchObject,
  updateTemporarySearch,
  handleSearchSubmit,
}: SearchProps) => {
  const { name, category } = temporarySearchObject;
  const { location, setSearchCity, setSearchCountry } = useGeoLocation();
  const { searchCity, searchCountry } = location;
  const { t } = useTranslation();
  const isMobile = useCheckMobileScreen();
  return (
    <Fragment>
      <TextField
        fullWidth={!isMobile}
        label={t("search.header.name")}
        variant="outlined"
        value={name}
        onChange={(e) => updateTemporarySearch("name", e.target.value)}
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
        value={category}
        onChange={(event, newValue) =>
          updateTemporarySearch("category", newValue || undefined)
        }
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
        value={countries.find((c) => c.code === searchCountry) || null}
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

const SearchLoading = () => {
  const isMobile = useCheckMobileScreen();
  const paddingLeft = isMobile ? 0 : 2;
  const paddingTop = isMobile ? 2 : 0;
  return (
    <Grid container>
      <Grid item xs={12} sm={2.35} sx={{ paddingTop }}>
        <Skeleton variant="rounded" height={60} />
      </Grid>
      <Grid item xs={12} sm={2.35} sx={{ paddingLeft, paddingTop }}>
        <Skeleton variant="rounded" height={60} />
      </Grid>
      <Grid item xs={12} sm={2.35} sx={{ paddingLeft, paddingTop }}>
        <Skeleton variant="rounded" height={60} />
      </Grid>
      <Grid item xs={12} sm={2.35} sx={{ paddingLeft, paddingTop }}>
        <Skeleton variant="rounded" height={60} />
      </Grid>
      <Grid item xs={12} sm={2.6} sx={{ paddingLeft, paddingTop }}>
        <Skeleton variant="rounded" height={60} />
      </Grid>
    </Grid>
  );
};
