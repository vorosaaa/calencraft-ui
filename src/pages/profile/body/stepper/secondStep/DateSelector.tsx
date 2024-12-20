import { BookyDatePicker } from "./BookyDatePicker";
import { TimeSlots } from "./slot/TimeSlots";
import { getProviderBookings } from "../../../../../api/userApi";
import { SessionType } from "../../../../../types/sessionType";
import { Button, Container, Typography } from "@mui/material";
import { UserProfile } from "../../../../../types/user";
import { useEffect, useState } from "react";
import {
  calculateEndTime,
  createCurrentTime,
  formatTime,
  getTimeInMinutes,
  hasBookingConflict,
  hasGroupSessionConflict,
  hasRegularBreakConflict,
  hasTemporaryBreakConflict,
  isDayAvailable,
  isTempBreakConflict,
} from "../stepperUtils";
import { NavigatorContainer } from "../css/BookingStepper.css";
import { t } from "i18next";
import {
  BookingState,
  ProviderBooking,
  ProviderBookingResponse,
} from "../../../../../types/booking";
import { TimeSlot } from "../../../../../types/timeSlot";
import { SessionCard } from "./SessionCard";
import { BookingType, RepeatType } from "../../../../../types/enums";
import { useQuery } from "@tanstack/react-query";

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
  const { data, isSuccess } = useQuery({
    queryKey: ["providerBookings", { id: provider.id, date: date.getTime() }],
    queryFn: () =>
      getProviderBookings({ id: provider.id, date: date.getTime() }),
  });

  useEffect(() => {
    if (isSuccess && data) {
      generatePossibleStartTimes(data);
    }
  }, [data, isSuccess]);

  const handleBackClick = () => {
    // Reset the selected start time
    onClick(undefined, undefined);
    handleBack();
  };

  /**
   * Generates possible start times based on the selected session and available data.
   * @param data - The provider booking response data.
   */
  const generatePossibleStartTimes = (data: ProviderBookingResponse) => {
    if (!booking) {
      console.error("Unpossible error");
      return;
    }

    const {
      startTime,
      endTime,
      lengthInMinutes,
      days,
      type,
      generationFrequency,
      repeat,
      name,
      maxCapacity,
    } = selectedSession;
    const { bookings, breaks } = data;

    const startTimeInMinutes = getTimeInMinutes(startTime);
    const endTimeInMinutes = getTimeInMinutes(endTime);

    const step = generationFrequency || 15;
    const possibleTimes: TimeSlot[] = [];

    if (
      isTempBreakConflict(date, lengthInMinutes, startTimeInMinutes, breaks) &&
      isTempBreakConflict(date, lengthInMinutes, endTimeInMinutes, breaks)
    ) {
      setPossibleStartTimes(possibleTimes);
      return;
    }
    for (
      let i = startTimeInMinutes;
      i <= endTimeInMinutes - lengthInMinutes;
      i += step
    ) {
      const currentTime = createCurrentTime(date, i);
      if (repeat !== RepeatType.ONCE && !isDayAvailable(currentTime, days))
        continue;

      const regularBreakConflict = hasRegularBreakConflict(
        currentTime,
        selectedSession.lengthInMinutes,
        breaks,
      );
      const temporaryBreakConflict = hasTemporaryBreakConflict(
        currentTime,
        lengthInMinutes,
        breaks,
      );
      const bookingConflicts = hasBookingConflict(
        currentTime,
        bookings,
        selectedSession,
      );
      const groupSessionConflict = hasGroupSessionConflict(
        currentTime,
        selectedSession,
        allSessionTypes,
      );

      let users = 0;
      let free = false;

      if (
        !bookingConflicts &&
        !regularBreakConflict &&
        !temporaryBreakConflict &&
        !groupSessionConflict
      ) {
        free = true;
      } else if (type === BookingType.GROUP) {
        const groupBookings = bookings.filter(
          (booking: ProviderBooking) =>
            booking.name === name &&
            booking.startTime === formatTime(currentTime),
        );
        users = groupBookings.length > 0 ? groupBookings[0].users.length : 0;
        free = users < (maxCapacity || 1);
      }
      if (currentTime > new Date() && (free || type === BookingType.GROUP)) {
        possibleTimes.push({
          startTime: formatTime(currentTime),
          users,
          free,
        });
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
          {t("profile.secondStep.selected", {
            startTime: selectedStartTime,
            endTime: calculateEndTime(
              selectedStartTime,
              selectedSession.lengthInMinutes,
            ),
          })}
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
