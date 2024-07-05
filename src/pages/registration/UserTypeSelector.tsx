import { Box, Button, Typography } from "@mui/material";
import { FormState } from "./Registration";
import { useTranslation } from "react-i18next";
import { useCheckMobileScreen } from "../../hooks/screenHook";

type Props = {
  formState: FormState;
  handleUserTypeClick: (value: "endUser" | "provider") => void;
};

export const UserTypeSelector = ({ handleUserTypeClick }: Props) => {
  const { t } = useTranslation();
  const isMobile = useCheckMobileScreen();
  return (
    <Box
      sx={{
        display: "flex",
        alignContent: "center",
        textAlign: "center",
        flexDirection: "column",
        width: "100%",
        mb: 8,
      }}
    >
      <Typography sx={{ mb: 4 }} variant="h6">
        {t("registration.question")}
      </Typography>
      <div
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "space-evenly",
        }}
      >
        <Button
          sx={{ marginBottom: isMobile ? 2 : 0 }}
          variant="outlined"
          onClick={() => handleUserTypeClick("endUser")}
        >
          {t("registration.user")}
        </Button>
        <Button
          variant="contained"
          onClick={() => handleUserTypeClick("provider")}
        >
          {t("registration.provider")}
        </Button>
      </div>
    </Box>
  );
};
