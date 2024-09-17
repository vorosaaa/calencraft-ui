import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";

type Props = {
  email: string;
  isLoading: boolean;
  setEmail: (v: string) => void;
  handleSendEmail: () => void;
};

export const ForgotPasswordComponent = ({
  email,
  isLoading,
  setEmail,
  handleSendEmail,
}: Props) => {
  const { t } = useTranslation();
  return (
    <Box>
      <Typography variant="body1" sx={{ mb: 4 }}>
        {t("verification.provide_email")}
      </Typography>
      <TextField
        fullWidth
        label={t("verification.email")}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        variant="outlined"
        size="small"
        inputProps={{
          maxLength: 50,
        }}
        sx={{ mb: 3 }}
      />

      <Button
        fullWidth
        color="primary"
        variant="contained"
        onClick={handleSendEmail}
        disabled={!email || isLoading}
        endIcon={isLoading && <CircularProgress size={16} />}
      >
        {t("verification.send_code")}
      </Button>
    </Box>
  );
};
