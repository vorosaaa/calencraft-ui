import { SessionType } from "../../../types/sessionType";

// Utility function to adjust start and end times based on the key and value provided
export const adjustTimes = (
  key: "startTime" | "endTime",
  value: string,
  selectedSession: SessionType,
  isFixed: boolean,
): { newStartTime: string; newEndTime: string; lengthInMinutes: number } => {
  const lengthInMinutes = selectedSession.lengthInMinutes || 0;
  let newStartTime = key === "startTime" ? value : selectedSession.startTime;
  let newEndTime = key === "endTime" ? value : selectedSession.endTime;

  const startTimeDate = createTimeFromString(newStartTime);
  const endTimeDate = createTimeFromString(newEndTime);
  const differenceInMinutes = calculateTimeDifference(
    startTimeDate,
    endTimeDate,
  );

  if (!isFixed && differenceInMinutes < lengthInMinutes) {
    if (key === "startTime") {
      newEndTime = adjustEndTime(startTimeDate, lengthInMinutes);
    } else if (key === "endTime") {
      newStartTime = adjustStartTime(endTimeDate, lengthInMinutes);
    }
  }

  // Original conditions to adjust based on the comparison of start and end times
  if (key === "startTime" && value > selectedSession.endTime) {
    const endTime = adjustDateByMinutes(
      timeStringToDate(value),
      lengthInMinutes,
    );
    newEndTime = endTime.toTimeString().substring(0, 5);
  } else if (key === "endTime" && value < selectedSession.startTime) {
    const startTime = adjustDateByMinutes(
      timeStringToDate(value),
      -lengthInMinutes,
    );
    newStartTime = startTime.toTimeString().substring(0, 5);
  }
  const diffInMinutes = isFixed
    ? calculateDiffInMinutes(newStartTime, newEndTime)
    : lengthInMinutes;

  return { newStartTime, newEndTime, lengthInMinutes: diffInMinutes };
};

export const handleLengthInMinutesChange = (
  session: SessionType,
  value: number, // Assuming value is already validated as a number
): { startTime: string; endTime: string } => {
  const lengthInMinutes = value;
  const startTime = new Date(`1970/01/01 ${session.startTime}`);
  const endTime = new Date(`1970/01/01 ${session.endTime}`);
  const diffInMinutes = (endTime.getTime() - startTime.getTime()) / (1000 * 60);

  if (diffInMinutes >= lengthInMinutes) {
    return { startTime: session.startTime, endTime: session.endTime };
  }

  const newEndTime = new Date(startTime.getTime() + lengthInMinutes * 60000);
  const newStartTime = new Date(endTime.getTime() - lengthInMinutes * 60000);

  // Adjust endTime if it doesn't go beyond midnight, otherwise adjust startTime
  if (newEndTime.getDate() === startTime.getDate()) {
    return {
      startTime: session.startTime,
      endTime: newEndTime.toTimeString().substring(0, 5),
    };
  } else if (newStartTime.getDate() === endTime.getDate()) {
    return {
      startTime: newStartTime.toTimeString().substring(0, 5),
      endTime: session.endTime,
    };
  }

  return { startTime: session.startTime, endTime: session.endTime };
};

// Helper function to convert a time string to a Date object
function createTimeFromString(time: string): Date {
  return new Date(`${new Date().toDateString()} ${time}`);
}

// Helper function to calculate the difference in minutes between two Date objects
function calculateTimeDifference(startTime: Date, endTime: Date): number {
  return (endTime.getTime() - startTime.getTime()) / 60000;
}

// Helper function to adjust the end time
function adjustEndTime(startTime: Date, lengthInMinutes: number): string {
  const adjustedEndTime = new Date(
    startTime.getTime() + lengthInMinutes * 60000,
  );
  return adjustedEndTime.toTimeString().substring(0, 5);
}

// Helper function to adjust the start time
function adjustStartTime(endTime: Date, lengthInMinutes: number): string {
  const adjustedStartTime = new Date(
    endTime.getTime() - lengthInMinutes * 60000,
  );
  return adjustedStartTime.toTimeString().substring(0, 5);
}

// Utility function to convert "HH:MM" to a Date object
function timeStringToDate(timeString: string): Date {
  const [hours, minutes] = timeString.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
}

// Utility function to adjust a Date object by a given number of minutes
function adjustDateByMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60000);
}

// Utility function to calculate the difference in minutes between two times
function calculateDiffInMinutes(startTime: string, endTime: string): number {
  const [startHours, startMinutes] = startTime.split(":").map(Number);
  const [endHours, endMinutes] = endTime.split(":").map(Number);

  const startDate = new Date();
  startDate.setHours(startHours, startMinutes, 0, 0);

  const endDate = new Date();
  endDate.setHours(endHours, endMinutes, 0, 0);

  return (endDate.getTime() - startDate.getTime()) / 60000;
}
