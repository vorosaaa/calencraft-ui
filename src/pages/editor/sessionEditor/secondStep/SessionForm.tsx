import {
  TextField,
  Container,
  Button,
  Grid,
  Box,
  Typography,
} from "@mui/material";
import { SessionType } from "../../../../types/sessionType";
import { NavigatorContainer } from "../../css/ProfileEditor.css";
import { useTranslation } from "react-i18next";
import { colors } from "../../../../theme/colors";
import { countries } from "../../../../types/countries";
import { ChangeEvent, useState } from "react";
import { Address } from "../../../../types/user";

type Props = {
  address?: Address;
  sessionType: SessionType;
  handleBack: () => void;
  handleNext: () => void;
  handleChange: (key: keyof SessionType, value: string | number) => void;
};

export const SessionForm = ({
  address,
  sessionType,
  handleBack,
  handleNext,
  handleChange,
}: Props) => {
  const { t } = useTranslation();
  const { name, description, maxCapacity, price } = sessionType;
  const [localPrice, setLocalPrice] = useState<number | string>(price || 0);
  const [localMaxCapacity, setLocalMaxCapacity] = useState<number | string>(
    maxCapacity || 1,
  );

  const handlePriceChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const value = e.target.value;
    setLocalPrice(value);
    handleChange("price", Number(value));
  };
  const handleMaxCapacityChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const value = e.target.value;
    setLocalMaxCapacity(value);
    handleChange("maxCapacity", Number(value));
  };
  const handlePriceBlur = () => {
    if (localPrice === "") {
      setLocalPrice(0);
      handleChange("price", 0);
    }
  };
  const handleMaxCapacityBlur = () => {
    if (localMaxCapacity === "") {
      setLocalMaxCapacity(1);
      handleChange("maxCapacity", 1);
    }
  };

  return (
    <Container>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <TextField
            label={t("editor.session_name")}
            fullWidth
            value={name}
            onChange={(e) => handleChange("name", e.target.value)}
            margin="normal"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label={t("editor.session_description")}
            fullWidth
            rows={2}
            multiline
            value={description}
            onChange={(e) => handleChange("description", e.target.value)}
            margin="normal"
            inputProps={{ maxLength: 300 }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label={t("editor.session_price")}
            fullWidth
            value={localPrice}
            onChange={handlePriceChange}
            onBlur={handlePriceBlur}
            type="number"
            margin="normal"
            InputProps={{
              endAdornment: address?.country && (
                <Box
                  sx={{
                    cursor: "default",
                    borderRadius: 1,
                    backgroundColor: colors.lightGrey,
                    padding: 1,
                    alignItems: "center",
                    "& > img": { mr: 0.5 },
                    display: "flex",
                    flexDirection: "row",
                    ml: 1,
                  }}
                >
                  <img
                    loading="lazy"
                    width="20"
                    srcSet={`https://flagcdn.com/w40/${address.country.toLowerCase()}.png 2x`}
                    src={`https://flagcdn.com/w20/${address.country.toLowerCase()}.png`}
                    alt=""
                  />
                  <Typography variant="caption">
                    {
                      countries.find((c) => c.code === address.country)
                        ?.currency
                    }
                  </Typography>
                </Box>
              ),
            }}
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            label={t("editor.session_max_attendance")}
            type="number"
            fullWidth
            value={localMaxCapacity}
            onChange={handleMaxCapacityChange}
            onBlur={handleMaxCapacityBlur}
            margin="normal"
          />
        </Grid>
      </Grid>

      <NavigatorContainer>
        <Button
          variant="outlined"
          color="primary"
          onClick={handleBack}
          sx={{ marginBottom: 2 }}
        >
          {t("editor.back")}
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleNext}
          sx={{ marginBottom: 2 }}
        >
          {t("editor.next")}
        </Button>
      </NavigatorContainer>
    </Container>
  );
};
