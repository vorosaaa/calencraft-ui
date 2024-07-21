import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  DialogActions,
  Button,
} from "@mui/material";
import { useMutation, useQueryClient } from "react-query";
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

export const VerificationModal: React.FC = () => {
  const { t } = useTranslation();
  const { saveAuth } = useAuth();
  const isMobile = useCheckMobileScreen();
  const queryClient = useQueryClient();
  const { open, mode, originalMode, setVerificationOpen, setVerificationMode } =
    useVerificationModalHook();

  const [token, setToken] = useState("");
  const [countdown, setCountdown] = useState(10);
  const [verificationCode, setVerificationCode] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { data } = useMe();

  const { mutate, isLoading } = useMutation(sendVerificationEmail, {
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
  const { mutate: mutateVerify } = useMutation(verifyEmail, {
    onSuccess: (data: any) => {
      if (originalMode === VerificationMode.VERIFICATION) {
        queryClient.invalidateQueries("me");
        closeModal();
      } else {
        setToken(data.token);
        setVerificationMode(VerificationMode.PASSWORD_RESET);
      }
    },
  });

  const { mutate: mutateReset } = useMutation(resetPassword, {
    onSuccess: (data: any) => {
      saveAuth(data.token);
      queryClient.invalidateQueries("me");
      closeModal();
    },
  });

  const handleSendEmail = () => {
    if (mode !== VerificationMode.FORGOT_PASSWORD) {
      setVerificationMode(VerificationMode.VERIFICATION);
    }
    mutate(email);
  };

  const closeModal = () => {
    setVerificationCode("");
    setVerificationOpen(false);
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
    <Dialog
      open={open}
      onClose={closeModal}
      fullWidth
      maxWidth="sm"
      fullScreen={isMobile}
    >
      <DialogTitle variant="h5">
        {originalMode === VerificationMode.FORGOT_PASSWORD
          ? t("verification.title_password_reset")
          : t("verification.title_verification")}
      </DialogTitle>
      <DialogContent sx={{ p: isMobile ? 1 : 3 }}>
        {mode === VerificationMode.FORGOT_PASSWORD && (
          <ForgotPasswordComponent
            email={email}
            isLoading={isLoading}
            setEmail={setEmail}
            handleSendEmail={handleSendEmail}
          />
        )}
        {mode === VerificationMode.VERIFICATION && (
          <CodeVerificationComponent
            isLoading={isLoading}
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
      </DialogContent>
      {isMobile && (
        <DialogActions>
          <Button onClick={() => closeModal()}>
            {t("verification.close")}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};
