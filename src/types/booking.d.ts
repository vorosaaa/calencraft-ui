import { SessionType } from "./SessionType";

export type ReducedBooking = {
  date: string;
  startTime: string;
  endTime: string;
  userCount: number;
};

export type BookingResponse = {
  id: string;
  provider: { id: string; name: string };
  users: { id: string; name: string }[];
  sessionType: {
    name: string;
    type: "PRIVATE" | "GROUP";
    maxCapacity: number;
    description: string;
    price: number;
    lengthInMinutes: number;
  };
  date: number;
  startTime: string;
  endTime: string;
};

export type BookingRequest = {
  providerId: string;
  date: number;
  startTime: string;
  sessionId: string;
  name: string;
  phoneNumber: string;
  email: string;
};

export type BookingState = {
  selectedDate?: Date;
  selectedStartTime?: string;
  selectedSession?: SessionType;
};
