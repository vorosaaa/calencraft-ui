import {
  GoogleLoginData,
  GoogleRegistrationData,
  RegistrationData,
  UserCredentials,
} from "../types/user";
import axiosClient from "./axiosClient";

export const login = async (credentials: UserCredentials) => {
  const response = await axiosClient.post("api/auth/login", credentials);
  return response.data;
};

export const register = async (personalData: RegistrationData) => {
  const response = await axiosClient.post("api/auth/register", personalData);
  return response.data;
};

export const validateToken = async () => {
  const response = await axiosClient.get("api/token");
  return response.data;
};

export const registerWithGoogle = async (body: GoogleRegistrationData) => {
  const response = await axiosClient.post("api/oauth/google/register", body);
  return response.data;
};

export const loginWithGoogle = async (body: GoogleLoginData) => {
  const response = await axiosClient.post("api/oauth/google/login", body);
  return response.data;
};
