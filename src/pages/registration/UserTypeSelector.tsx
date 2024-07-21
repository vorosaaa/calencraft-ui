import { Box, Button, Typography } from "@mui/material";
import { FormState } from "./Registration";
import { useTranslation } from "react-i18next";

type Props = {
  formState: FormState;
  handleUserTypeClick: (value: "endUser" | "provider") => void;
};

export const UserTypeSelector = ({ handleUserTypeClick }: Props) => {
  const { t } = useTranslation();
  return (
    <Box
      sx={{
        display: "flex",
        alignContent: "center",
        textAlign: "center",
        flexDirection: "column",
        mb: 4,
      }}
    >
      <Typography sx={{ mb: 4 }} variant="h6">
        {t("registration.question")}
      </Typography>

      <Button
        sx={{ marginBottom: 2, p: 2 }}
        variant="outlined"
        onClick={() => handleUserTypeClick("endUser")}
      >
        {t("registration.user")}
      </Button>
      <Button
        sx={{ p: 2 }}
        variant="contained"
        onClick={() => handleUserTypeClick("provider")}
      >
        {t("registration.provider")}
      </Button>
    </Box>
  );
};
