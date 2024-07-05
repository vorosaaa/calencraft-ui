import { RepeatType } from "./RepeatType";
import { BookingType } from "./enums";

export type SessionType = {
  id?: string;
  type?: BookingType;
  maxCapacity?: number;
  name: string;
  lengthInMinutes: number;
  startTime: string;
  days: string[];
  repeat: RepeatType;
  endTime: string;
  description: string;
  price: number;
  currency?: string;
};
