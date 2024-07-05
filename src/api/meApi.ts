import axiosClient from "./axiosClient";

export const getMe = async () => {
  const response = await axiosClient.get("api/user/me");
  return response.data;
};

export const deleteUser = async () => {
  const response = await axiosClient.delete(`/api/user`);
  return response.data;
};

export const updateProfile = async (form: FormData) => {
  // Send the data to your server using Axios
  const response = await axiosClient.put("/api/user", form);
  return response.data;
};

export const uploadProfilePicture = async (form: FormData) => {
  const response = await axiosClient.put("/api/user/picture", form, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const uploadCoverPicture = async (form: FormData) => {
  const response = await axiosClient.put("/api/user/cover", form, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
