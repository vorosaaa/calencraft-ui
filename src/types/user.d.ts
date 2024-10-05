import { CountryCode } from "./country";
import { SessionType } from "./sessionType";
import { SubscriptionType } from "./enums";

export type UserAtom = {
  email: string;
} & UserProfile;

export type UserCredentials = {
  email: string;
  password: string;
};
export type RegistrationData = {
  personalData: PersonalData;
};

export type GoogleRegistrationData = {
  token: string;
  type: "endUser" | "provider";
  country?: CountryCode;
};

export type GoogleLoginData = {
  token: string;
};

export type PersonalData = {
  userType: "endUser" | "provider";
  name: string;
  email: string;
  phone: string;
  password: string;
  country?: CountryCode;
};

export type Address = {
  zipCode?: string;
  country?: CountryCode | null;
  city?: string;
  street?: string;
};

export type UserProfile = {
  subscription?: SubscriptionType;
  coverPosition: string;
  name: string;
  email: string;
  phone: string;
  picUrl: string;
  coverUrl: string;
  id: string;
  currency: string;
  description: string;
  sessionTypes?: SessionType[];
  isProvider: boolean;
  goals: string[];
};
