import { BreakStateType } from "../types/breakStateType";
import { CountryCode } from "../types/enums";
import { SessionType } from "../types/sessionType";
import { UserProfile } from "../types/user";
import axiosClient from "./axiosClient";

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
  if (
    typeof type.validFrom === "string" ||
    typeof type.validFrom === "object"
  ) {
    type.validFrom = new Date(type.validFrom).getTime();
  }
  const response = await axiosClient.post(`/api/provider/type`, type);
  return response.data;
};

export const deleteType = async (id: string) => {
  const response = await axiosClient.delete(`/api/provider/type/${id}`);
  return response.data;
};

export const saveBreaks = async (br: BreakStateType): Promise<UserProfile> => {
  const response = await axiosClient.post(`/api/provider/break`, br);
  return response.data;
};

export const deleteBreak = async (id: string) => {
  const response = await axiosClient.delete(`/api/provider/break/${id}`);
  return response.data;
};
