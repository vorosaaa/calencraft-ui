import { enqueueSnackbar } from "notistack";

const errorTimestamps: { [key: string]: number } = {};

export const enqueueError = (error: string) => {
  const now = Date.now();
  const lastShown = errorTimestamps[error];

  if (!lastShown || now - lastShown > 60000) {
    // 1 minute = 60000 milliseconds
    enqueueSnackbar(error, {
      autoHideDuration: 10000,
      variant: "error",
    });
    errorTimestamps[error] = now; // Update the timestamp for this error
  }
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
