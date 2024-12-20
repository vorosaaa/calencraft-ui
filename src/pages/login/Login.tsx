import React, { useEffect, useState } from "react";
import {
  Box,
  CssBaseline,
  Divider,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { login, loginWithGoogle } from "../../api/authApi";
import { FormParent, SubmitButton } from "./Login.css";
import { useAuth } from "../../hooks/authHook";
import { useTranslation } from "react-i18next";
import { useVerificationModalHook } from "../../hooks/verificationHook";
import { VerificationMode } from "../../types/enums";
import { useNavigate } from "react-router-dom";
import { CustomCarousel } from "../../components/auth/CustomCarousel";
import { useCheckMobileScreen } from "../../hooks/screenHook";
import {
  CredentialResponse,
  GoogleLogin,
  googleLogout,
} from "@react-oauth/google";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const Login = () => {
  const { t } = useTranslation();
  const { setVerification } = useVerificationModalHook();
  const { saveAuth } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const isMobile = useCheckMobileScreen();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { mutate: googleLogin } = useMutation({
    mutationFn: loginWithGoogle,
    onSuccess: (data) => {
      saveAuth(data.token);
      queryClient.refetchQueries({ queryKey: ["me"] });
      navigate("/calendar");
    },
  });
  const { mutate } = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      saveAuth(data.token);
      setEmail("");
      setPassword("");
      queryClient.refetchQueries({ queryKey: ["me"] });
      navigate("/calendar");
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
    setVerification(
      VerificationMode.FORGOT_PASSWORD,
      VerificationMode.FORGOT_PASSWORD,
    );
    navigate("/verification");
  };

  const handleLogin = async () => mutate({ email, password });
  const onRegistrationClick = () => navigate("/register");
  // When Google login succeeds
  const onGoogleLoginSuccess = (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) throw new Error("No credential found");
    googleLogin({ token: credentialResponse.credential });
    googleLogout();
  };

  // When Google login fails
  const onGoogleLoginError = () => {
    console.error("Google login failed");
  };

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
    <Grid container spacing={0}>
      <CssBaseline />
      <Grid
        sx={{
          paddingLeft: isMobile ? 2 : 8,
          paddingRight: isMobile ? 2 : 8,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
        item
        xs={12}
        md={4}
      >
        <Typography sx={{ mb: 4, textAlign: "center" }} variant="h5">
          {t("login.title")}
        </Typography>

        <FormParent>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <GoogleLogin
              onSuccess={onGoogleLoginSuccess}
              onError={onGoogleLoginError}
            />
          </Box>
          <Divider sx={{ my: 2 }}>{t("login.or")}</Divider>
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
      </Grid>
      <Grid item xs={0} md={8}>
        <CustomCarousel />
      </Grid>
    </Grid>
  );
};
