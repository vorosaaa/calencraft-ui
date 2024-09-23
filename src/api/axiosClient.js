import axios from "axios";

import { config } from "../config/config";

const axiosClient = axios.create({
  baseURL: config.SERVER_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json, text/plain, */*",
  },
  timeout: 20000,
});

const onRequest = (config) => {
  // eslint-disable-next-line no-undef
  const token = JSON.parse(localStorage.getItem("token"));
  config.headers.Authorization = token ? `Bearer ${token}` : null;
  return config;
};

const onRequestError = (error) => {
  console.error(error);
  return Promise.reject(error);
};

axiosClient.interceptors.request.use(onRequest, onRequestError);

export default axiosClient;
