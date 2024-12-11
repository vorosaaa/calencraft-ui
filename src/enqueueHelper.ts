import { enqueueSnackbar } from "notistack";

export const enqueueError = (error: string) => {
  enqueueSnackbar(error, {
    autoHideDuration: 10000,
    variant: "error",
  });
};

export const enqueueSuccess = (message: string) => {
  enqueueSnackbar(message, {
    variant: "success",
  });
};

export const enqueueWarning = (message: string) => {
  enqueueSnackbar(message, {
    autoHideDuration: 10000,
    variant: "warning",
  });
};
