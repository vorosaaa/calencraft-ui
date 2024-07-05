import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { useTranslation } from "react-i18next";
import { SessionType } from "../../../../../types/SessionType";

type Props = {
  selectedSession: SessionType;
  currentValue: Date | null;
  handleDateChange: (date: Date | null) => void;
};

export const BookyDatePicker = ({
  currentValue,
  selectedSession,
  handleDateChange,
}: Props) => {
  const { t } = useTranslation();
  const daysOfWeek = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        shouldDisableDate={(date) => {
          // Get the day of the week for the date
          const dayOfWeek = daysOfWeek[date.getDay()];

          return !selectedSession.days.includes(dayOfWeek);
        }}
        disablePast
        sx={{ marginTop: 2, width: "100%" }}
        label={t("profile.secondStep.date")}
        value={currentValue}
        onChange={handleDateChange}
      />
    </LocalizationProvider>
  );
};
