import React from "react";
import { Autocomplete, Box, Grid, TextField } from "@mui/material";
import { Address } from "../../../types/user";
import { useTranslation } from "react-i18next";
import { CountryType } from "../../../types/country";
import { countries } from "../../../types/countries";

type Props = {
  name: string;
  address: Address | null;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const AddressAccordionContent = ({
  name,
  address,
  handleInputChange,
}: Props) => {
  const { t } = useTranslation();

  const setCountry = (country: CountryType | null) => {
    const event = {
      target: { name: name + ".country", value: country?.code || null },
    } as React.ChangeEvent<HTMLInputElement>;
    handleInputChange(event);
  };
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} lg={6}>
        <Autocomplete
          value={countries.find((counrty) => counrty.code === address?.country)}
          autoHighlight
          onChange={(_event, newValue: CountryType | null) =>
            setCountry(newValue)
          }
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
              {t(`countries.${option.code}`) || option.label} ({option.code})
            </Box>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              name={`${name}.country`}
              label={t("editor.country")}
              inputProps={{
                ...params.inputProps,
                autoComplete: "new-password", // disable autocomplete and autofill
              }}
            />
          )}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          variant="outlined"
          fullWidth
          label={t("editor.zip")}
          name={`${name}.zipCode`}
          value={address?.zipCode}
          onChange={handleInputChange}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          variant="outlined"
          fullWidth
          label={t("editor.city")}
          name={`${name}.city`}
          value={address?.city}
          onChange={handleInputChange}
        />
      </Grid>
      <Grid item xs={12} lg={6}>
        <TextField
          variant="outlined"
          fullWidth
          label={t("editor.street")}
          name={`${name}.street`}
          value={address?.street}
          onChange={handleInputChange}
        />
      </Grid>
    </Grid>
  );
};
