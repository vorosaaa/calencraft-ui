import { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { login } from "../../api/authApi";
import { FormParent, SubmitButton } from "./Login.css";
import { useMutation, useQueryClient } from "react-query";
import { useAuth } from "../../hooks/authHook";
import { useTranslation } from "react-i18next";
import { useCheckMobileScreen } from "../../hooks/screenHook";
import { useVerificationModalHook } from "../../hooks/verificationHook";
import { VerificationMode } from "../../types/enums";
import { Visibility, VisibilityOff } from "@mui/icons-material";

type Props = {
  open: boolean;
  handleClose: () => void;
  onRegistrationClick: () => void;
};

export const Login: React.FC<Props> = ({
  open,
  handleClose,
  onRegistrationClick,
}: Props) => {
  const { t } = useTranslation();
  const { setVerification } = useVerificationModalHook();
  const { saveAuth } = useAuth();
  const queryClient = useQueryClient();
  const isMobile = useCheckMobileScreen();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { mutate } = useMutation(login, {
    onSuccess: (data) => {
      saveAuth(data.token);
      setEmail("");
      setPassword("");
      handleClose();
      queryClient.invalidateQueries("me");
    },
  });

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };

  const handleForgotPassword = () => {
    setEmail("");
    setPassword("");
    handleClose();
    setVerification(
      true,
      VerificationMode.FORGOT_PASSWORD,
      VerificationMode.FORGOT_PASSWORD,
    );
  };
  const handleLogin = async () => mutate({ email, password });

  useEffect(() => {
    if (!email || !password) return;
    const keyDownHandler = (event: any) => {
      if (event.key === "Enter") {
        event.preventDefault();
        handleLogin();
      }
    };

    document.addEventListener("keydown", keyDownHandler);
    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, [email, password]);

  return (
    <Dialog open={open} onClose={handleClose} fullScreen={isMobile}>
      <DialogTitle variant="h4" align="center" gutterBottom>
        {t("login.title")}
      </DialogTitle>
      <DialogContent>
        <FormParent>
          <TextField
            label={t("login.email")}
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            variant="outlined"
          />
          <TextField
            label={t("login.password")}
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type={showPassword ? "text" : "password"}
            margin="normal"
            variant="outlined"
            sx={{ mb: 0 }}
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
          <div
            style={{
              display: "flex",
              justifyContent: "right",
            }}
            onClick={handleForgotPassword}
          >
            <Typography sx={{ cursor: "pointer" }} variant="caption">
              {t("login.forgot")}
            </Typography>
          </div>
          <SubmitButton
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleLogin}
          >
            {t("login.button")}
          </SubmitButton>
          <div onClick={onRegistrationClick}>
            <Typography sx={{ cursor: "pointer", textAlign: "center" }}>
              {t("login.register")}
            </Typography>
          </div>
        </FormParent>
      </DialogContent>
      {isMobile && (
        <DialogActions onClick={handleClose}>
          <Button fullWidth>{t("login.back")}</Button>
        </DialogActions>
      )}
    </Dialog>
  );
};
