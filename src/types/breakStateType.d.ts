import { BreakType } from "./enums";

export type BreakStateType = {
  id?: string;
  name: string;
  from?: number;
  to?: number;
  startTime?: string;
  endTime?: string;
  type: BreakType;
  days?: string[];
};
