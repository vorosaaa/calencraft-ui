import { Grid, TextField } from "@mui/material";
import { ChangeEvent } from "react";
import { useTranslation } from "react-i18next";

type Props = {
  name: string;
  phoneNumber: string;
  description: string;
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

export const UserPersonalContent = ({
  name,
  phoneNumber,
  description,
  handleInputChange,
}: Props) => {
  const { t } = useTranslation();
  return (
    <Grid container spacing={2} sx={{ mb: 2 }}>
      <Grid item xs={12}>
        <TextField
          variant="outlined"
          fullWidth
          label={t("editor.name")}
          name="name"
          value={name}
          onChange={handleInputChange}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          variant="outlined"
          fullWidth
          rows={4}
          multiline
          label={t("editor.description")}
          name="description"
          value={description}
          onChange={handleInputChange}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label={t("editor.phone_number")}
          variant="outlined"
          fullWidth
          name="phoneNumber"
          type="tel"
          value={phoneNumber}
          onChange={handleInputChange}
        />
      </Grid>
    </Grid>
  );
};
