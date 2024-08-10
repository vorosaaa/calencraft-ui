import { UserProfile } from "../types/user";
import axiosClient from "./axiosClient";
import { EmailRequestBody } from "../types/emailBody";
import { ProviderBookingResponse } from "../types/booking";

export const getUser = async (id: string): Promise<UserProfile> => {
  const response = await axiosClient.get(`api/user/${id}`);
  return response.data.resultList[0];
};

export const saveEmail = async (
  body: EmailRequestBody,
): Promise<UserProfile> => {
  const response = await axiosClient.put(`/api/user/email`, body);
  return response.data;
};

export const getProviderBookings = async ({
  id,
  date,
}: {
  id: string;
  date: number;
}): Promise<ProviderBookingResponse> => {
  if (!date) return { bookings: [], breaks: [] };
  const response = await axiosClient.get(`/api/provider/${id}/bookings`, {
    params: { date },
  });
  return response.data.resultList[0];
};
