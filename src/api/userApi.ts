import { ReducedBooking } from "../types/booking";
import { SessionType } from "../types/sessionType";
import { CountryCode } from "../types/enums";
import { UserProfile } from "../types/user";
import axiosClient from "./axiosClient";
import { BreakStateType } from "../types/breakStateType";
import { EmailRequestBody } from "../types/emailBody";

export const getUser = async (id: string): Promise<UserProfile> => {
  const response = await axiosClient.get(`api/user/${id}`);
  return response.data.resultList[0];
};

export const getProviders = async (
  page: number,
  pageSize: number,
  name?: string,
  city?: string,
  country?: CountryCode,
  category?: string,
) => {
  const response = await axiosClient.get(`/api/provider`, {
    params: {
      name,
      city,
      country,
      category,
      page,
      pageSize,
    },
  });
  return response.data;
};

export const savesTypes = async (type: SessionType): Promise<UserProfile> => {
  const response = await axiosClient.post(`/api/provider/type`, type);
  return response.data;
};

export const saveBreaks = async (br: BreakStateType): Promise<UserProfile> => {
  const response = await axiosClient.post(`/api/provider/break`, br);
  return response.data;
};

export const saveEmail = async (
  body: EmailRequestBody,
): Promise<UserProfile> => {
  const response = await axiosClient.put(`/api/user/email`, body);
  return response.data;
};

export const getAvailablePlaces = async ({
  id,
  date,
}: {
  id: string;
  date: number;
}): Promise<ReducedBooking[]> => {
  if (!date) return [];
  const response = await axiosClient.get(`/api/provider/${id}/bookings`, {
    params: { date },
  });
  return response.data.resultList[0];
};
