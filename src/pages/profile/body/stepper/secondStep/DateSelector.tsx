import { BookyDatePicker } from "./BookyDatePicker";
import { TimeSlots } from "./slot/TimeSlots";
import { useQuery } from "react-query";
import { getAvailablePlaces } from "../../../../../api/userApi";
import { SessionType } from "../../../../../types/sessionType";
import { Button, Container, Typography } from "@mui/material";
import { UserProfile } from "../../../../../types/user";
import { useState } from "react";
import {
  calculateEndTime,
  createCurrentTime,
  formatTime,
  getTimeInMinutes,
  hasBookingConflict,
  hasBreakConflict,
  hasGroupSessionConflict,
  isDayAvailable,
} from "../stepperUtils";
import { NavigatorContainer } from "../css/BookingStepper.css";
import { t } from "i18next";
import { BookingState } from "../../../../../types/booking";
import { TimeSlot } from "../../../../../types/timeSlot";
import { SessionCard } from "./SessionCard";
import { BookingType } from "../../../../../types/enums";

type Props = {
  provider: UserProfile;
  booking: BookingState;
  allSessionTypes?: SessionType[];
  date: Date;
  handleBack: () => void;
  handleNext: () => void;
  onClick: (date?: Date, startTime?: string) => void;
  onDateClick: (d: Date) => void;
};

export const DateSelector = ({
  provider,
  booking,
  allSessionTypes,
  date,
  handleBack,
  handleNext,
  onClick,
  onDateClick,
}: Props) => {
  const [possibleStartTimes, setPossibleStartTimes] = useState<TimeSlot[]>([]);

  const { selectedSession, selectedStartTime } = booking;
  if (!selectedSession) return <></>;

  // Get bookings and breaks for the selected day and provider
  useQuery(
    ["providerBookings", { id: provider.id, date: date.getTime() }],
    () => getAvailablePlaces({ id: provider.id, date: date.getTime() }),
    {
      onSuccess: (data) => generatePossibleStartTimes(data),
    },
  );

  const handleBackClick = () => {
    // Reset the selected start time
    onClick(undefined, undefined);
    handleBack();
  };

  const generatePossibleStartTimes = (data: any) => {
    if (!booking) {
      console.error("Unpossible error");
      return;
    }

    const { startTime, endTime, lengthInMinutes, days } = selectedSession;
    const { bookings, breaks } = data;

    const startTimeInMinutes = getTimeInMinutes(startTime);
    const endTimeInMinutes = getTimeInMinutes(endTime);

    const possibleTimes: TimeSlot[] = [];
    const step = 15;

    for (
      let i = startTimeInMinutes;
      i <= endTimeInMinutes - lengthInMinutes;
      i += step
    ) {
      const currentTime = createCurrentTime(date, i);

      if (isDayAvailable(currentTime, days)) {
        const bookingConflicts = hasBookingConflict(
          currentTime,
          bookings,
          selectedSession,
        );
        const breakConflicts = hasBreakConflict(currentTime, breaks);
        const groupSessionConflict = hasGroupSessionConflict(
          currentTime,
          selectedSession,
          allSessionTypes,
        );

        let users = 0;
        let free = false;

        if (!bookingConflicts && !breakConflicts && !groupSessionConflict) {
          free = true;
        } else if (selectedSession.type === BookingType.GROUP) {
          const groupBookings = bookings.filter(
            (booking: any) =>
              booking.sessionType.name === selectedSession.name &&
              booking.startTime === formatTime(currentTime),
          );
          users = groupBookings.length > 0 ? groupBookings[0].users.length : 0;
          free = users < selectedSession.maxCapacity!;
        }

        if (free || selectedSession.type === "GROUP") {
          possibleTimes.push({
            startTime: formatTime(currentTime),
            users,
            free,
          });
        }
      }
    }
    setPossibleStartTimes(possibleTimes);
  };

  const handleDateChange = (date: Date | null) => {
    if (!date) return;
    onDateClick(date);
  };

  const onSlotClick = (startTime: string, free: boolean) => {
    if (!free) return;
    onClick(date, startTime);
  };
  return (
    <Container sx={{ mt: 2 }}>
      <SessionCard session={selectedSession} />
      {selectedStartTime && (
        <Typography variant="body1" sx={{ mt: 2, mb: 2 }}>
          Kiválasztott időpont: {selectedStartTime} -
          {calculateEndTime(selectedStartTime, selectedSession.lengthInMinutes)}
        </Typography>
      )}
      <BookyDatePicker
        selectedSession={selectedSession}
        currentValue={date}
        handleDateChange={handleDateChange}
      />

      {date && (
        <TimeSlots
          selectedStartTime={booking.selectedStartTime}
          maxCapacity={selectedSession.maxCapacity}
          onClick={onSlotClick}
          slots={possibleStartTimes}
        />
      )}
      <NavigatorContainer>
        <Button variant="outlined" onClick={handleBackClick}>
          {t("profile.back")}
        </Button>
        <Button
          variant="outlined"
          disabled={!selectedStartTime}
          onClick={handleNext}
        >
          {t("profile.next")}
        </Button>
      </NavigatorContainer>
    </Container>
  );
};
