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
import { FormState } from "../../../../types/formState";

type Props = {
  formState: FormState;
  sessionType: SessionType;
  handleBack: () => void;
  handleNext: () => void;
  handleChange: (key: keyof SessionType, value: string | number) => void;
};

export const SessionForm = ({
  formState,
  sessionType,
  handleBack,
  handleNext,
  handleChange,
}: Props) => {
  const { t } = useTranslation();
  const { name, description, maxCapacity, price } = sessionType;
  const { address } = formState;

  const onNextClick = () => {
    handleNext();
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
            value={description}
            onChange={(e) => handleChange("description", e.target.value)}
            margin="normal"
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label={t("editor.session_price")}
            fullWidth
            value={price || 0}
            onChange={(e) => handleChange("price", Number(e.target.value))}
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
            value={maxCapacity || 1}
            onChange={(e) =>
              handleChange("maxCapacity", Number(e.target.value))
            }
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
          onClick={onNextClick}
          sx={{ marginBottom: 2 }}
        >
          {t("editor.next")}
        </Button>
      </NavigatorContainer>
    </Container>
  );
};
