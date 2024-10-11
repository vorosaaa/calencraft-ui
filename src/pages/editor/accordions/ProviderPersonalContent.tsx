import {
  Box,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Tooltip,
} from "@mui/material";
import { ServiceCategory } from "../../../types/enums";
import { ChangeEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { Info } from "@mui/icons-material";

type Props = {
  name: string;
  slug?: string;
  phoneNumber: string;
  description: string;
  serviceCategory: string;
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (e: SelectChangeEvent<string>) => void;
};

export const ProviderPersonalContent = ({
  name,
  slug,
  phoneNumber,
  description,
  serviceCategory,
  handleInputChange,
  handleSelectChange,
}: Props) => {
  const { t } = useTranslation();
  const [tooltipOpen, setTooltipOpen] = useState(false);

  return (
    <Grid container spacing={2} sx={{ mb: 2 }}>
      <Grid item xs={12} sm={6}>
        <TextField
          variant="outlined"
          fullWidth
          label={t("editor.name")}
          name="name"
          value={name}
          onChange={handleInputChange}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          variant="outlined"
          fullWidth
          label={t("editor.slug")}
          name="slug"
          placeholder={t("editor.slug_placeholder")}
          value={slug}
          onChange={handleInputChange}
          inputProps={{ maxLength: 50 }}
          InputProps={{
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
          inputProps={{ maxLength: 600 }}
        />
      </Grid>
      <Grid item xs={12} lg={6}>
        <FormControl variant="outlined" fullWidth>
          <InputLabel id="service-type-label">
            {t("editor.service_type")}
          </InputLabel>
          <Select
            labelId="service-type-label"
            id="service-type"
            value={serviceCategory || ""}
            label={t("editor.service_type")}
            onChange={handleSelectChange}
            name="serviceCategory" // Add name attribute for handling input change
          >
            {Object.values(ServiceCategory).map((type) => (
              <MenuItem key={type} value={type}>
                {t(`service_types.${type}`)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} lg={6}>
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
