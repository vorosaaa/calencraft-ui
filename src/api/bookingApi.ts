import {
  BookingRequest,
  BookingResponse,
  ManualBookingRequest,
} from "../types/booking";
import axiosClient from "./axiosClient";

export const confirmBooking = async (request: BookingRequest) => {
  const response = await axiosClient.post(`api/booking`, request);
  return response.data;
};

export const createManualBooking = async (request: ManualBookingRequest) => {
  const response = await axiosClient.post(`api/booking/manual`, request);
  return response.data;
};

export const getMyBookings = async (
  startTime: Date | null,
  endTime: Date | null,
  userType: "provider" | "user",
): Promise<BookingResponse[]> => {
  if (!startTime || !endTime || !userType) return [];
  const response = await axiosClient.get(`api/booking`, {
    params: {
      startTime: startTime.getTime(),
      endTime: endTime.getTime(),
      provider: userType === "provider",
    },
  });

  return response.data.resultList;
};

export const getBooking = async (id: string): Promise<BookingResponse> => {
  const response = await axiosClient.get(`api/booking/${id}`);
  return response.data.resultList[0];
};

export const deleteBooking = async ({
  id,
  reason,
}: {
  id: string;
  reason: string;
}) => {
  const response = await axiosClient.delete(`api/booking/${id}`, {
    data: { message: reason },
  });
  return response.data;
};
