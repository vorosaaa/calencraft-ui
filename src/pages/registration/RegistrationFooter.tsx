import { Box, Button, DialogActions, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useCheckMobileScreen } from "../../hooks/screenHook";
import { FormState } from "./Registration";

type FooterProps = {
  form: FormState;
  currentStep: number;
  handleClose: () => void;
  handleBack: () => void;
  handleSubmit: () => void;
};

export const RegistrationFooter = ({
  form,
  currentStep,
  handleClose,
  handleBack,
  handleSubmit,
}: FooterProps) => {
  const isMobile = useCheckMobileScreen();

  const { t } = useTranslation();
  const isDisabled =
    !form.accepted || !form.email || !form.name || !form.password;
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
          <Button
            onClick={handleSubmit}
            color="primary"
            variant="contained"
            disabled={isDisabled}
          >
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
