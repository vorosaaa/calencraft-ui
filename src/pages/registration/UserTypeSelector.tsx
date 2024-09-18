import { Box, Button, Typography } from "@mui/material";
import { FormState } from "./Registration";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

type Props = {
  formState: FormState;
  handleUserTypeClick: (value: "endUser" | "provider") => void;
};

export const UserTypeSelector = ({ handleUserTypeClick }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const onLoginClick = () => navigate("/login");

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        mb: 4,
      }}
    >
      <Typography sx={{ mb: 2 }} variant="body1">
        {t("registration.question")}
      </Typography>

      <Button
        sx={{ marginBottom: 2, p: 1 }}
        variant="outlined"
        onClick={() => handleUserTypeClick("endUser")}
      >
        {t("registration.user")}
      </Button>
      <Button
        sx={{ mb: 2, p: 1 }}
        variant="contained"
        onClick={() => handleUserTypeClick("provider")}
      >
        {t("registration.provider")}
      </Button>
      <div style={{ marginTop: 24 }} onClick={onLoginClick}>
        <Typography sx={{ cursor: "pointer", textAlign: "center" }}>
          {t("registration.login")}
        </Typography>
      </div>
    </Box>
  );
};
