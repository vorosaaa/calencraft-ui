import { Fragment, useState } from "react";
import { RecoilRoot } from "recoil";
import { Root } from "./Root";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter } from "react-router-dom";
import "./i18n";
import { SnackbarProvider, closeSnackbar } from "notistack";
import { enqueueError, enqueueSuccess } from "./enqueueHelper";
import { IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { config } from "./config/config";

export const App = () => {
  return (
    <Fragment>
      <GoogleOAuthProvider clientId={config.GOOGLE_CLIENT_ID}>
        <SnackbarProvider
          maxSnack={3}
          action={(snackbarId) => (
            <IconButton onClick={() => closeSnackbar(snackbarId)}>
              <Close fontSize="small" />
            </IconButton>
          )}
        >
          <RecoilRoot>
            <QueryClientLoader />
          </RecoilRoot>
        </SnackbarProvider>
      </GoogleOAuthProvider>
    </Fragment>
  );
};

const QueryClientLoader = () => {
  const { t } = useTranslation();
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
            onError: (error: any) => {
              if (error.response.data.message !== "NO_TOKEN") {
                enqueueError(
                  t(`messages.errors.${error.response.data.message}`)
                );
              }
            },
          },
          mutations: {
            onSuccess: (data: any) => {
              if (data.success) {
                enqueueSuccess(t(`messages.success.${data.message}`));
              } else {
                enqueueError(t(`messages.errors.${data.message}`));
              }
            },
            onError: (error: any) => {
              enqueueError(t(`messages.errors.${error.response.data.message}`));
            },
          },
        },
      })
  );
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Root />
      </BrowserRouter>
    </QueryClientProvider>
  );
};
