import { Box, Button, DialogActions, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useCheckMobileScreen } from "../../hooks/screenHook";

type FooterProps = {
  currentStep: number;
  handleClose: () => void;
  handleBack: () => void;
  handleSubmit: () => void;
};

export const RegistrationFooter = ({
  currentStep,
  handleClose,
  handleBack,
  handleSubmit,
}: FooterProps) => {
  const isMobile = useCheckMobileScreen();

  const { t } = useTranslation();
  return (
    <DialogActions
      sx={{
        display: "flex",
        flexDirection: "column",
        padding: 2,
        paddingLeft: 3,
        paddingRight: 3,
      }}
    >
      {currentStep === 2 && (
        <Box
          sx={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <Button onClick={handleBack} color="primary">
            <Typography>{t("registration.back")}</Typography>
          </Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">
            <Typography>{t("registration.register")}</Typography>
          </Button>
        </Box>
      )}
      {isMobile && (
        <Button fullWidth onClick={handleClose}>
          <Typography variant="caption">{t("registration.close")}</Typography>
        </Button>
      )}
    </DialogActions>
  );
};
