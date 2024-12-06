import { Fragment, useMemo } from "react";
import { RecoilRoot } from "recoil";
import { Root } from "./Root";
import { BrowserRouter } from "react-router-dom";
import "./i18n";
import { SnackbarProvider, closeSnackbar } from "notistack";
import { enqueueError, enqueueSuccess } from "./enqueueHelper";
import { IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { config } from "./config/config";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Helmet } from "react-helmet";

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
  const queryClient = useMemo(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: (error) => {
            if (error instanceof AxiosError) {
              const axiosError = error as AxiosError;
              if (
                axiosError.response?.data &&
                typeof axiosError.response.data === "object"
              ) {
                const errorMessage = (
                  axiosError.response?.data as { message: string }
                ).message;
                console.log(errorMessage);
                if (errorMessage !== "NO_TOKEN") {
                  enqueueError(t(`messages.errors.${errorMessage}`));
                }
              }
            } else {
              enqueueError(t(`messages.errors.${error.message}`));
            }
          },
        }),
        defaultOptions: {
          queries: {
            retry: false,
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
      }),
    [t],
  );
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Helmet>
          <title>{t("title")}</title>
          <meta name="description" content={t("description")} />
        </Helmet>
        <Root />
      </BrowserRouter>
    </QueryClientProvider>
  );
};
