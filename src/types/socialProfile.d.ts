import { SocialPlatform } from "./enums";

export type SocialProfile = {
  platform: SocialPlatform;
  username: string;
  link: string;
};
