import { Button, CircularProgress, Container, Typography } from "@mui/material";
import { MultipleTextInput } from "../../components/input/MultipleTextInput";
import { useTranslation } from "react-i18next";
import { useVerificationModalHook } from "../../hooks/verificationHook";
import { VerificationMode } from "../../types/enums";
import { useNavigate } from "react-router-dom";

type Props = {
  countDown: number;
  isLoading: boolean;
  verificationCode: string;
  setVerificationCode: (s: string) => void;
  handleSendEmail: () => void;
  handleVerify: () => void;
};

export const CodeVerificationComponent = ({
  countDown,
  isLoading,
  verificationCode,
  setVerificationCode,
  handleSendEmail,
  handleVerify,
}: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { originalMode } = useVerificationModalHook();
  const isVerification = originalMode === VerificationMode.VERIFICATION;
  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        paddingTop: 2,
      }}
      disableGutters
    >
      <Typography>{t("verification.description")} </Typography>
      <div
        style={{
          display: "flex",
          marginBottom: 32,
          marginTop: 24,
        }}
      >
        <MultipleTextInput
          gridItemSize={1.5}
          inputValue={verificationCode}
          setInputValue={setVerificationCode}
          length={8}
        />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {isVerification && (
          <Button variant="text" onClick={() => navigate("/")}>
            {t("verification.later")}
          </Button>
        )}
        <Button
          variant="outlined"
          onClick={handleSendEmail}
          disabled={countDown > 0 || isLoading}
          endIcon={isLoading && <CircularProgress size={16} />}
        >
          {countDown === 0
            ? t("verification.resend")
            : `${t("verification.resend")} (${countDown}s)`}
        </Button>
        <Button variant="contained" color="primary" onClick={handleVerify}>
          {isVerification ? t("verification.verify") : t("verification.next")}
        </Button>
      </div>
    </Container>
  );
};
