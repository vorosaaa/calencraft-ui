import { Button, Grid, CssBaseline, Typography } from "@mui/material";
import {
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
} from "../../api/emailApi";
import { VerificationMode } from "../../types/enums";
import { useVerificationModalHook } from "../../hooks/verificationHook";
import { useEffect, useMemo, useState } from "react";
import { ForgotPasswordComponent } from "./ForgotPasswordComponent";
import { CodeVerificationComponent } from "./CodeVerificationComponent";
import { PasswordResetComponent } from "./PasswordResetComponent";
import { useCheckMobileScreen } from "../../hooks/screenHook";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../hooks/authHook";
import { enqueueError, enqueueSuccess } from "../../enqueueHelper";
import { useMe } from "../../queries/queries";
import { CustomCarousel } from "../../components/auth/CustomCarousel";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const Verification = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { saveAuth } = useAuth();
  const isMobile = useCheckMobileScreen();
  const queryClient = useQueryClient();
  const { mode, originalMode, setVerificationMode } =
    useVerificationModalHook();

  const [token, setToken] = useState("");
  const [countdown, setCountdown] = useState(10);
  const [verificationCode, setVerificationCode] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { data } = useMe();

  const { mutate, isPending } = useMutation({
    mutationFn: sendVerificationEmail,
    onSuccess: (data: any) => {
      setVerificationMode(VerificationMode.VERIFICATION);
      setCountdown(10);
      data.success
        ? enqueueSuccess(t(`messages.success.${data.message}`))
        : enqueueError(t(`messages.errors.${data.message}`));
    },
    onError: (error: any) => {
      setCountdown(10);
      enqueueError(t(`messages.errors.${error.response.data.message}`));
    },
  });
  const { mutate: mutateVerify } = useMutation({
    mutationFn: verifyEmail,
    onSuccess: (data: any) => {
      if (originalMode === VerificationMode.VERIFICATION) {
        queryClient.invalidateQueries({ queryKey: ["me"] });
        setVerificationCode("");
        navigate("/myprofile");
      } else {
        setToken(data.token);
        setVerificationMode(VerificationMode.PASSWORD_RESET);
      }
    },
  });

  const { mutate: mutateReset } = useMutation({
    mutationFn: resetPassword,
    onSuccess: (data: any) => {
      saveAuth(data.token);
      queryClient.invalidateQueries({ queryKey: ["me"] });
      navigateToHome();
    },
  });

  const handleSendEmail = () => {
    if (mode !== VerificationMode.FORGOT_PASSWORD) {
      setVerificationMode(VerificationMode.VERIFICATION);
    }
    mutate(email);
  };

  const navigateToHome = () => {
    setVerificationCode("");
    navigate("/");
  };

  const handleVerify = () => mutateVerify({ code: verificationCode, email });
  const handleReset = () => mutateReset({ password, token });

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [countdown]);

  useMemo(() => {
    if (originalMode === VerificationMode.VERIFICATION) {
      handleSendEmail();
    }
  }, [originalMode]);

  useEffect(() => {
    if (!data) return;
    setEmail(data.user.email);
  }, [data]);

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
        <Typography variant="h5" align="left" sx={{ mb: 4 }}>
          {originalMode === VerificationMode.FORGOT_PASSWORD
            ? t("verification.title_password_reset")
            : t("verification.title_verification")}
        </Typography>
        {mode === VerificationMode.FORGOT_PASSWORD && (
          <ForgotPasswordComponent
            email={email}
            isLoading={isPending}
            setEmail={setEmail}
            handleSendEmail={handleSendEmail}
          />
        )}
        {mode === VerificationMode.VERIFICATION && (
          <CodeVerificationComponent
            isLoading={isPending}
            countDown={countdown}
            verificationCode={verificationCode}
            setVerificationCode={setVerificationCode}
            handleSendEmail={handleSendEmail}
            handleVerify={handleVerify}
          />
        )}
        {mode === VerificationMode.PASSWORD_RESET && (
          <PasswordResetComponent
            email={email}
            password={password}
            setPassword={setPassword}
            handleSubmit={handleReset}
          />
        )}
        {isMobile && (
          <Button onClick={navigateToHome}>{t("verification.close")}</Button>
        )}
      </Grid>
      <Grid item xs={0} md={8}>
        <CustomCarousel />
      </Grid>
    </Grid>
  );
};
