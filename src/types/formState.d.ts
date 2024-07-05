import { SubscriptionType } from "./enums";

export type FormState = {
  emailStatus: EmailStatus;
  isProvider: false;
  name: string;
  serviceCategory: string;
  description: string;
  coverUrl: string;
  coverPosition: string;
  address?: Address;
  phoneNumber: string;
  subscriptionType?: SubscriptionType;
};
