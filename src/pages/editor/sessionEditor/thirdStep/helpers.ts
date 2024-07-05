import { SelectedTimeFrames } from "./Details";

// Helper function to categorize time frames
export const categorizeTimeFrames = (timeFrames: string[]) => {
  const morningTimeFrames: string[] = [];
  const afternoonTimeFrames: string[] = [];
  const eveningTimeFrames: string[] = [];

  timeFrames.forEach((timeFrame) => {
    const [startHour] = timeFrame.split(":");
    const hour = parseInt(startHour, 10);

    if (hour < 12) {
      morningTimeFrames.push(timeFrame);
    } else if (hour >= 12 && hour < 17) {
      afternoonTimeFrames.push(timeFrame);
    } else {
      eveningTimeFrames.push(timeFrame);
    }
  });

  return { morningTimeFrames, afternoonTimeFrames, eveningTimeFrames };
};

//Helper function to generate time frames
export const generateTimeFrames = (
  trainingLength: number,
  startTime: string,
  endTime: string,
): string[] => {
  const startHour = parseInt(startTime.split(":")[0]);
  const startMinute = parseInt(startTime.split(":")[1]);
  const endHour = Math.min(parseInt(endTime.split(":")[0]), 23); // Ensure endTime doesn't exceed 23
  const endMinute = Math.min(parseInt(endTime.split(":")[1]), 59); // Ensure endTime doesn't exceed 59

  const timeFrames: string[] = [];
  if (trainingLength === 0) return timeFrames;
  let currentHour = startHour;
  let currentMinute = startMinute;

  while (
    currentHour < endHour ||
    (currentHour === endHour && currentMinute < endMinute)
  ) {
    const endMinuteHour = currentHour * 60 + currentMinute + trainingLength;
    const frameEndHour = Math.floor(endMinuteHour / 60);
    const frameEndMinute = endMinuteHour % 60;

    const frameEndTime = `${frameEndHour
      .toString()
      .padStart(2, "0")}:${frameEndMinute.toString().padStart(2, "0")}`;

    if (
      frameEndHour > endHour ||
      (frameEndHour === endHour && frameEndMinute > endMinute)
    ) {
      break; // End time exceeded, stop generating frames
    }

    const startTime = `${currentHour
      .toString()
      .padStart(2, "0")}:${currentMinute.toString().padStart(2, "0")}`;

    timeFrames.push(`${startTime} - ${frameEndTime}`);

    currentHour = frameEndHour;
    currentMinute = frameEndMinute;
  }

  return timeFrames;
};
// Helper function to check if a time frame is within a specified time range
const isFrameWithinRange = (
  frame: string,
  startTime: string,
  endTime: string,
) => {
  const frameStart = frame.split(" - ")[0];
  const frameEnd = frame.split(" - ")[1];

  return frameStart >= startTime && frameEnd <= endTime;
};

export const filterFrames = (
  selectedTimeFrames: SelectedTimeFrames,
  startTime: string,
  endTime: string,
) => {
  return Object.fromEntries(
    Object.entries(selectedTimeFrames).map(([day, frames]) => [
      day,
      frames.filter((frame) => isFrameWithinRange(frame, startTime, endTime)),
    ]),
  );
};
