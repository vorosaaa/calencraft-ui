import { Button, Container, TextField } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";

type Props = {
  email: string;
  password: string;
  setPassword: (pw: string) => void;
  handleSubmit: () => void;
};

export const PasswordResetComponent = ({
  email,
  password,
  handleSubmit,
  setPassword,
}: Props) => {
  const { t } = useTranslation();
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordComplexityError, setPasswordComplexityError] = useState(false);
  const [passwordMatchError, setPasswordMatchError] = useState(false);
  const [emptyPasswordError, setEmptyPasswordError] = useState(false);

  const onSubmit = () => {
    const isPasswordSimple = !validatePassword(password);
    const isPasswordMismatch = password !== confirmPassword;
    const isPasswordEmpty = !password;
    setEmptyPasswordError(isPasswordEmpty);
    setPasswordMatchError(isPasswordMismatch);
    setPasswordComplexityError(isPasswordSimple);
    if (!password || isPasswordSimple || isPasswordMismatch) {
      console.error("Errors during password validation");
      return;
    }
    handleSubmit();
  };
  return (
    <Container
      sx={{ display: "flex", flexDirection: "column", paddingTop: 2 }}
      disableGutters
    >
      <TextField
        margin="dense"
        fullWidth
        label={t("verification.email")}
        value={email}
        variant="outlined"
        disabled
      />
      <TextField
        fullWidth
        label={t("verification.password")}
        margin="dense"
        type="password"
        name="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={passwordComplexityError || emptyPasswordError}
        helperText={
          emptyPasswordError
            ? t("verification.password_empty")
            : passwordComplexityError
              ? t("verification.password_complexity")
              : ""
        }
      />
      <TextField
        fullWidth
        margin="dense"
        label={t("verification.password_repeat")}
        type="password"
        name="confirmPassword"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        error={passwordMatchError}
        helperText={passwordMatchError ? t("verification.password_same") : ""}
      />
      <Button variant="contained" onClick={onSubmit} sx={{ mt: 2 }}>
        {t("verification.reset")}
      </Button>
    </Container>
  );
};

export const validatePassword = (password: string): boolean => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d.,-]{8,}$/;
  return passwordRegex.test(password);
};
