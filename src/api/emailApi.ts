import axiosClient from "./axiosClient";

export const sendVerificationEmail = async (email?: string) => {
  // Send the data to your server using Axios
  const response = await axiosClient.put("/api/user/code", { email });
  return response.data;
};

export const verifyEmail = async ({
  code,
  email,
}: {
  code: string;
  email?: string;
}) => {
  // Send the data to your server using Axios
  const response = await axiosClient.put("/api/user/verify", { code, email });
  return response.data;
};

export const resetPassword = async ({
  password,
  token,
}: {
  password: string;
  token: string;
}) => {
  // Send the data to your server using Axios
  const response = await axiosClient.put("/api/user/reset", {
    password,
    token,
  });
  return response.data;
};
