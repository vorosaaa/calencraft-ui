import { AxiosError, AxiosResponse } from "axios";

export type CalencraftAxiosError = {
  response: {
    data: { success: boolean; message: string };
  } & AxiosResponse;
} & AxiosError;
