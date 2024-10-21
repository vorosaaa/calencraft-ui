import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Container,
  Typography,
} from "@mui/material";
import { Footer } from "./css/Verification.css";
import { useCheckMobileScreen } from "../../../../../hooks/screenHook";
import { useTranslation } from "react-i18next";
import { calculateEndTime, formatTime } from "../stepperUtils";
import { UserState } from "../../../../../types/userState";
import { BookingState } from "../../../../../types/booking";

type Props = {
  bookingState: BookingState;
  isLoading: boolean;
  formData: UserState;
  onConfirm: () => void;
  onBack: () => void;
};
export const VerificationPage = ({
  bookingState,
  formData,
  isLoading,
  onConfirm,
  onBack,
}: Props) => {
  const { t } = useTranslation();
  const isMobile = useCheckMobileScreen();
  return (
    <Container sx={{ mt: 2 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "space-between",
        }}
      >
        <Card elevation={2} sx={{ flex: 1, mr: isMobile ? 0 : 1 }}>
          <CardHeader title={t("profile.fourthStep.booking")} />
          <CardContent>
            <Typography>
              {t("profile.fourthStep.session")}:{" "}
              {bookingState.selectedSession?.name}
            </Typography>
            <Typography>
              {t("profile.fourthStep.date")}:{" "}
              {bookingState.selectedDate?.toLocaleDateString()}
            </Typography>
            <Typography>
              {t("profile.fourthStep.from")}: {formatTime(bookingState.selectedStartTime!)}
            </Typography>
            <Typography>
              {t("profile.fourthStep.until")}:{" "}
              {calculateEndTime(
                bookingState.selectedStartTime,
                bookingState.selectedSession?.lengthInMinutes,
              )}
            </Typography>
          </CardContent>
        </Card>

        <Card
          elevation={2}
          sx={{ flex: 1, ml: isMobile ? 0 : 1, mt: isMobile ? 1 : 0 }}
        >
          <CardHeader title={t("profile.fourthStep.personal")} />

          <CardContent>
            <Typography>
              {t("profile.fourthStep.name")}: {formData.name}
            </Typography>
            <Typography>
              {t("profile.fourthStep.email")}: {formData.email}
            </Typography>
            <Typography>
              {t("profile.fourthStep.phone")}: {formData.phoneNumber}
            </Typography>
          </CardContent>
        </Card>
      </Box>
      <Footer>
        <Button variant="outlined" color="primary" onClick={onBack}>
          {t("profile.back")}
        </Button>
        <Button variant="contained" color="primary" onClick={onConfirm}>
          {isLoading ? (
            <CircularProgress color="inherit" size={24} />
          ) : (
            t("profile.fourthStep.confirm")
          )}
        </Button>
      </Footer>
    </Container>
  );
};
