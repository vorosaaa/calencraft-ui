import { GoogleRegistrationData, RegistrationData, UserCredentials } from "../types/user";
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

// Method to send Google token to backend for verification
export const verifyGoogleToken = async (googleToken: any) => {
  try {
    const response = await axiosClient.post("/api/auth/google/verify", {
      token: googleToken,  // Sending the Google token in request body
    });
    return response.data; // return the data from the backend
    
  } catch (error) {
    console.error("Error verifying Google token:", error);
    throw error; // Re-throw error for handling in the caller function
  }
};

// Method for Google Authentication
export const googleAuth = async (personalData: GoogleRegistrationData) => {
  const response = await axiosClient.post("api/auth/google/auth", personalData);
  return response.data;
};