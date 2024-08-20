import { BookingType, BreakType } from "./enums";
import { SessionType } from "./sessionType";

export type ReducedBooking = {
  date: string;
  startTime: string;
  endTime: string;
  userCount: number;
};

export type BookingResponse = {
  id: string;
  name: string;
  price: number;
  provider: { id: string; name: string };
  users: { id: string; name: string }[];
  sessionType: {
    type: BookingType;
    maxCapacity: number;
    description: string;
    lengthInMinutes: number;
  };
  date: number;
  startTime: string;
  endTime: string;
};

export type ManualBookingRequest = {
  name: string;
  date: number;
  startTime: string;
  endTime: string;
  price: number;
  users: { name: string; email: string }[];
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

export type ProviderBookingResponse = {
  bookings: ProviderBooking[];
  breaks: ProviderBreak[];
};

export type ProviderBooking = {
  name: string;
  date: number;
  endTime: string;
  startTime: string;
  users: { id: string; name: string }[];
  sessionType: {
    maxCapacity: number;
  };
};

export type ProviderBreak = {
  days: string[];
  endTime: string;
  startTime: string;
  to: string;
  from: string;
  type: BreakType;
};
