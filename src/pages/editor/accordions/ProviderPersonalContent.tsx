import {
  Box,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
} from "@mui/material";
import { ServiceCategory } from "../../../types/enums";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Info } from "@mui/icons-material";
import { Controller, useFormContext } from "react-hook-form";
import { FormState } from "../../../types/formState";

export const ProviderPersonalContent = () => {
  const { t } = useTranslation();
  const { control, formState } = useFormContext<Partial<FormState>>();
  const { errors } = formState;
  const [tooltipOpen, setTooltipOpen] = useState(false);

  return (
    <Grid container spacing={2} sx={{ mb: 2 }}>
      <Grid item xs={12} sm={6}>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              variant="outlined"
              error={!!errors.name}
              helperText={errors.name?.message}
              fullWidth
              label={t("editor.name")}
            />
          )}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Controller
          name="slug"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              variant="outlined"
              fullWidth
              error={!!errors.slug}
              helperText={errors.slug?.message}
              label={t("editor.slug")}
              placeholder={t("editor.slug_placeholder")}
              InputProps={{
                inputProps: { maxLength: 50 },
                endAdornment: (
                  <Tooltip
                    title={t("editor.slug_tooltip")}
                    arrow
                    placement="left"
                    open={tooltipOpen}
                  >
                    <Box
                      sx={{ display: "flex", justifyContent: "center" }}
                      className="info-icon-container"
                      onClick={() => setTooltipOpen(true)}
                      onMouseEnter={() => setTooltipOpen(true)}
                      onMouseLeave={() => setTooltipOpen(false)}
                    >
                      <Info className="info-icon" color="info" />
                    </Box>
                  </Tooltip>
                ),
              }}
            />
          )}
        />
      </Grid>
      <Grid item xs={12}>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              variant="outlined"
              fullWidth
              rows={4}
              error={!!errors.description}
              helperText={errors.description?.message}
              multiline
              label={t("editor.description")}
              inputProps={{ maxLength: 600 }}
            />
          )}
        />
      </Grid>
      <Grid item xs={12} lg={6}>
        <FormControl variant="outlined" fullWidth>
          <InputLabel id="service-type-label">
            {t("editor.service_type")}
          </InputLabel>
          <Controller
            name="serviceCategory"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                labelId="service-type-label"
                id="service-type"
                label={t("editor.service_type")}
                name="serviceCategory" // Add name attribute for handling input change
              >
                {Object.values(ServiceCategory).map((type) => (
                  <MenuItem key={type} value={type}>
                    {t(`service_types.${type}`)}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
        </FormControl>
      </Grid>
      <Grid item xs={12} lg={6}>
        <Controller
          name="phoneNumber"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label={t("editor.phone_number")}
              variant="outlined"
              error={!!errors.phoneNumber}
              helperText={errors.phoneNumber?.message}
              fullWidth
              name="phoneNumber"
              type="tel"
            />
          )}
        />
      </Grid>
    </Grid>
  );
};
