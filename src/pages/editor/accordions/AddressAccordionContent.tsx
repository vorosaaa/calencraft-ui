import { Autocomplete, Box, Grid, TextField } from "@mui/material";
import { Address } from "../../../types/user";
import { useTranslation } from "react-i18next";
import { CountryType } from "../../../types/country";
import { countries } from "../../../types/countries";
import { useFormContext } from "react-hook-form";

type Props = {
  name: "address" | "billingAddress";
  address: Address | null;
  hasMissingFields?: boolean;
  handleAddressChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const AddressAccordionContent = ({
  name,
  address,
  hasMissingFields,
  handleAddressChange,
}: Props) => {
  const { t } = useTranslation();
  const { setValue } = useFormContext();

  const setCountry = (country: CountryType | null) => {
    if (handleAddressChange) {
      handleAddressChange({
        target: { name: "country", value: country?.code || "" },
      } as React.ChangeEvent<HTMLInputElement>);
    } else {
      setValue(name, { ...address, country: country?.code || null });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (handleAddressChange) {
      handleAddressChange(e);
    } else {
      setValue(name, { ...address, [e.target.name]: e.target.value });
    }
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
              key={option.code}
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
              label={t("editor.country")}
              error={!address?.country && hasMissingFields}
              helperText={
                !address?.country && hasMissingFields
                  ? t("editor.required")
                  : undefined
              }
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
          name={`zipCode`}
          value={address?.zipCode}
          onChange={handleInputChange}
          error={!address?.zipCode && hasMissingFields}
          helperText={
            !address?.zipCode && hasMissingFields
              ? t("editor.required")
              : undefined
          }
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          variant="outlined"
          fullWidth
          label={t("editor.city")}
          name={`city`}
          value={address?.city}
          onChange={handleInputChange}
          error={!address?.city && hasMissingFields}
          helperText={
            !address?.city && hasMissingFields
              ? t("editor.required")
              : undefined
          }
        />
      </Grid>
      <Grid item xs={12} lg={6}>
        <TextField
          variant="outlined"
          fullWidth
          label={t("editor.street")}
          name={`street`}
          value={address?.street}
          onChange={handleInputChange}
          error={!address?.street && hasMissingFields}
          helperText={
            !address?.street && hasMissingFields
              ? t("editor.required")
              : undefined
          }
        />
      </Grid>
    </Grid>
  );
};
