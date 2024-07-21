import { Button, CircularProgress, Container, Typography } from "@mui/material";
import { MultipleTextInput } from "../../components/input/MultipleTextInput";
import { useCheckMobileScreen } from "../../hooks/screenHook";
import { useTranslation } from "react-i18next";

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
  const isMobile = useCheckMobileScreen();
  const { t } = useTranslation();
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
          marginBottom: 24,
          marginTop: 24,
        }}
      >
        <MultipleTextInput
          gridItemSize={isMobile ? 1.5 : 1.2}
          inputValue={verificationCode}
          setInputValue={setVerificationCode}
          length={8}
        />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
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
          {t("verification.next")}
        </Button>
      </div>
    </Container>
  );
};
