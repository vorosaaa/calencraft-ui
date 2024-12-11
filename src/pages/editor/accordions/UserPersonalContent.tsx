import { Grid, TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

export const UserPersonalContent = () => {
  const { t } = useTranslation();
  const { control } = useFormContext();
  return (
    <Grid container spacing={2} sx={{ mb: 2 }}>
      <Grid item xs={12}>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <TextField
              variant="outlined"
              fullWidth
              label={t("editor.name")}
              {...field}
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
              variant="outlined"
              fullWidth
              rows={4}
              multiline
              label={t("editor.description")}
              {...field}
            />
          )}
        />
      </Grid>
      <Grid item xs={12}>
        <Controller
          name="phoneNumber"
          control={control}
          render={({ field }) => (
            <TextField
              variant="outlined"
              fullWidth
              label={t("editor.phone_number")}
              {...field}
            />
          )}
        />
      </Grid>
    </Grid>
  );
};
