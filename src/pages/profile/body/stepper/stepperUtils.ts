import { ProviderBooking, ProviderBreak } from "../../../../types/booking";
import { BookingType, BreakType } from "../../../../types/enums";
import { SessionType } from "../../../../types/sessionType";

export const getTimeInMinutes = (time: string): number => {
  const [hour, minute] = time.split(":").map((part) => parseInt(part));
  return hour * 60 + minute;
};

export const createCurrentTime = (date: Date, minutes: number): Date => {
  const currentTime = new Date(date);
  currentTime.setSeconds(0); // Clear seconds
  currentTime.setMilliseconds(0); // Clear milliseconds
  currentTime.setHours(Math.floor(minutes / 60), minutes % 60);
  return currentTime;
};

export const formatTime = (time: Date): string => {
  return time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

export const isDayAvailable = (
  time: Date,
  availableDays: string[],
): boolean => {
  const day = time
    .toLocaleDateString("en-US", { weekday: "long" })
    .toLowerCase();
  return availableDays.includes(day);
};

export const hasBookingConflict = (
  startTime: Date,
  bookings: ProviderBooking[],
  sessionType: SessionType,
): boolean => {
  return bookings.some((booking: ProviderBooking) => {
    const bookingDate = new Date(booking.date); // Get the booking date
    const [bookingStartHour, bookingStartMinute] = booking.startTime
      .split(":")
      .map(Number);
    const [bookingEndHour, bookingEndMinute] = booking.endTime
      .split(":")
      .map(Number);

    // Construct a Date object for the booking start time
    const bookingStartTime = new Date(bookingDate);
    bookingStartTime.setHours(bookingStartHour, bookingStartMinute, 0); // Set hours and minutes
    const bookingEndTime = new Date(bookingDate);
    bookingEndTime.setHours(bookingEndHour, bookingEndMinute, 0); // Set hours and minutes

    // Convert booking start and end times to milliseconds
    const bookingStartMs = bookingStartTime.getTime();
    const bookingEndMs = bookingEndTime.getTime();

    // Convert current time to milliseconds
    const startTimeMs = startTime.getTime();
    const endTime = new Date(startTimeMs);
    endTime.setMinutes(endTime.getMinutes() + sessionType.lengthInMinutes);
    const endTimeMs = endTime.getTime();

    // Check if current start time falls within the booking duration
    const isStartTimeConflict =
      startTimeMs >= bookingStartMs && startTimeMs < bookingEndMs;

    // Check if calculated end time falls within the booking duration
    const isEndTimeConflict =
      endTimeMs > bookingStartMs && endTimeMs <= bookingEndMs;

    // Check if session type is GROUP and booking is not full
    const isGroupSessionConflict =
      sessionType.type === BookingType.GROUP &&
      booking.name === sessionType.name &&
      sessionType.maxCapacity &&
      booking.users.length < sessionType.maxCapacity;

    // Return true if there is a conflict (booking overlap or group session not full)
    return isStartTimeConflict || isEndTimeConflict || isGroupSessionConflict;
  });
};

export const hasTemporaryBreakConflict = (
  time: Date,
  lengthInMinutes: number,
  breaks: ProviderBreak[],
): boolean => {
  return breaks.some((breakItem: ProviderBreak) => {
    if (breakItem.type === BreakType.REGULAR) return false;

    const startTime = new Date(Number(breakItem.from));
    const endTime = new Date(Number(breakItem.to));

    // Parse startTime and endTime
    const [startHours, startMinutes] = breakItem.startTime
      .split(":")
      .map(Number);
    const [endHours, endMinutes] = breakItem.endTime.split(":").map(Number);

    startTime.setHours(startHours, startMinutes, 0, 0);
    endTime.setHours(endHours, endMinutes, 0, 0);

    // Get currentTime in milliseconds for comparison
    const currentTimeInMilliseconds = time.getTime();
    const endTimeInMilliseconds = time.getTime() + lengthInMinutes * 60 * 1000;
    // Check if currentTime is within the break's start and end times
    return (
      (currentTimeInMilliseconds >= startTime.getTime() &&
        currentTimeInMilliseconds < endTime.getTime()) ||
      (endTimeInMilliseconds > startTime.getTime() &&
        endTimeInMilliseconds <= endTime.getTime()) ||
      (currentTimeInMilliseconds < startTime.getTime() &&
        endTimeInMilliseconds > endTime.getTime())
    );
  });
};

export const hasRegularBreakConflict = (
  time: Date,
  lengthInMinutes: number,
  breaks: ProviderBreak[],
): boolean => {
  const daysOfWeek = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  const currentDay = daysOfWeek[time.getDay()];
  const currentTimeInMilliseconds = time.getTime();
  const endTimeInMilliseconds = time.getTime() + lengthInMinutes * 60 * 1000;
  return breaks.some((breakItem: ProviderBreak) => {
    if (breakItem.type !== "REGULAR" || !breakItem.days.includes(currentDay)) {
      return false;
    }

    const breakStartDate = new Date(time);
    const [startHours, startMinutes] = breakItem.startTime
      .split(":")
      .map(Number);
    breakStartDate.setHours(startHours, startMinutes, 0, 0);
    const breakStartInMilliseconds = breakStartDate.getTime();

    const breakEndDate = new Date(time);
    const [endHours, endMinutes] = breakItem.endTime.split(":").map(Number);
    breakEndDate.setHours(endHours, endMinutes, 0, 0);
    const breakEndInMilliseconds = breakEndDate.getTime();

    return (
      (currentTimeInMilliseconds >= breakStartInMilliseconds &&
        currentTimeInMilliseconds < breakEndInMilliseconds) ||
      (endTimeInMilliseconds > breakStartInMilliseconds &&
        endTimeInMilliseconds <= breakEndInMilliseconds) ||
      (currentTimeInMilliseconds < breakStartInMilliseconds &&
        endTimeInMilliseconds > breakEndInMilliseconds)
    );
  });
};

export const hasGroupSessionConflict = (
  time: Date,
  sessionType: SessionType,
  allSessionTypes?: SessionType[],
): boolean => {
  if (sessionType.type === "PRIVATE") {
    const groupSessions =
      allSessionTypes?.filter((session) => session.type === "GROUP") || [];
    return groupSessions.some((session) => {
      const sessionStart = new Date(session.startTime).getTime();
      const sessionEnd = new Date(session.endTime).getTime();
      const currentTimeInMilliseconds = time.getTime();
      return (
        currentTimeInMilliseconds >= sessionStart &&
        currentTimeInMilliseconds < sessionEnd
      );
    });
  }
  return false;
};

export const calculateEndTime = (
  startTime?: string,
  lengthInMinutes?: number,
): string => {
  if (!startTime || !lengthInMinutes) return "Invalid time";
  const [startHour, startMinute] = startTime.split(":").map(Number);

  // Calculate total minutes from the start time
  let totalMinutes = startHour * 60 + startMinute;

  // Add the length in minutes
  totalMinutes += lengthInMinutes;

  // Calculate hours and minutes for the end time
  const endHour = Math.floor(totalMinutes / 60) % 24;
  const endMinute = totalMinutes % 60;

  // Format the end time
  const formattedEndHour = endHour < 10 ? `0${endHour}` : `${endHour}`;
  const formattedEndMinute = endMinute < 10 ? `0${endMinute}` : `${endMinute}`;

  return `${formattedEndHour}:${formattedEndMinute}`;
};

export const isTempBreakConflict = (
  date: Date,
  lengthInMinutes: number,
  timeInMinutes: number,
  breaks: ProviderBreak[],
) =>
  hasTemporaryBreakConflict(
    createCurrentTime(date, timeInMinutes),
    lengthInMinutes,
    breaks,
  );
