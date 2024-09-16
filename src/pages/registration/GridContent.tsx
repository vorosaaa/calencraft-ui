import {
  Checkbox,
  FormControlLabel,
  Grid,
  IconButton,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { ErrorState, FormState } from "./Registration";
import { useCheckMobileScreen } from "../../hooks/screenHook";
import { useTranslation } from "react-i18next";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";

type GridProps = {
  formState: FormState;
  error: ErrorState;
  handleInputChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    checked?: boolean,
  ) => void;
};

export const GridContent = ({
  formState,
  error,
  handleInputChange,
}: GridProps) => {
  const {
    passwordComplexity,
    passwordEmpty,
    passwordMatch,
    nameEmpty,
    emailEmpty,
    invalidEmailFormat,
  } = error;
  const isMobile = useCheckMobileScreen();
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };

  return (
    <Grid container>
      <TextField
        label={t("registration.name")}
        fullWidth
        margin="normal"
        name="name"
        value={formState.name}
        onChange={handleInputChange}
        error={nameEmpty}
        helperText={nameEmpty ? t("registration.name_empty") : ""}
      />
      <TextField
        type="email"
        label={t("registration.email")}
        fullWidth
        margin="normal"
        name="email"
        value={formState.email}
        onChange={handleInputChange}
        error={emailEmpty || invalidEmailFormat}
        helperText={
          emailEmpty
            ? t("registration.email_empty")
            : invalidEmailFormat
              ? t("registration.email_format")
              : ""
        }
      />
      <Grid sx={{ paddingRight: isMobile ? 0 : 1 }} item xs={isMobile ? 12 : 6}>
        <TextField
          fullWidth
          label={t("registration.password")}
          type={showPassword ? "text" : "password"}
          margin="normal"
          name="password"
          value={formState.password}
          onChange={handleInputChange}
          error={passwordComplexity || passwordEmpty}
          helperText={
            passwordEmpty
              ? t("registration.password_empty")
              : passwordComplexity
                ? t("registration.password_complexity")
                : ""
          }
          InputProps={{
            endAdornment: (
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            ),
          }}
        />
      </Grid>
      <Grid item xs={isMobile ? 12 : 6}>
        <TextField
          fullWidth
          label={t("registration.password_repeat")}
          type={showPassword ? "text" : "password"}
          margin="normal"
          name="confirmPassword"
          value={formState.confirmPassword}
          onChange={handleInputChange}
          error={passwordMatch}
          helperText={passwordMatch ? t("registration.password_same") : ""}
          InputProps={{
            endAdornment: (
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            ),
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Checkbox
              checked={formState.accepted}
              onChange={(e, checked) => handleInputChange(e, checked)}
              name="accepted"
            />
          }
          label={
            <Typography variant="body2">
              {t("registration.accept")}&nbsp;
              <Link href="/termsofservice">{t("registration.terms")}</Link>
              &nbsp;{t("registration.and")}&nbsp;
              <Link href="/privacy">{t("registration.privacy")}</Link>.
            </Typography>
          }
        />
      </Grid>
    </Grid>
  );
};
