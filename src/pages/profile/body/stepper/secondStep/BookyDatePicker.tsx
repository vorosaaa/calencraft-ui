import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { useTranslation } from "react-i18next";
import { SessionType } from "../../../../../types/sessionType";
import { RepeatType } from "../../../../../types/enums";

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
          // Get the valid from date
          const validFromDate = new Date(Number(selectedSession.validFrom));
          // Check if the date is the same as the valid from date
          const isDateOnValidFrom =
            date.toDateString() === validFromDate.toDateString();
          if (selectedSession.repeat === RepeatType.ONCE) {
            return !isDateOnValidFrom;
          }
          // Get the day of the week for the date
          const dayOfWeek = daysOfWeek[date.getDay()];
          const isDayAvailable = selectedSession.days.includes(dayOfWeek);
          // Check if the date is after the valid from date
          const isDateAfterValidFrom =
            stripTime(date).getTime() >= stripTime(validFromDate).getTime();

          return !isDayAvailable || !isDateAfterValidFrom;
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

const stripTime = (date: string | number | Date) => {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
};
