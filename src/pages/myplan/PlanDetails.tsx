import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { useMutation, useQueryClient } from "react-query";
import {
  Backdrop,
  Button,
  CircularProgress,
  Container,
  Paper,
  Typography,
} from "@mui/material";
import { deleteSubscription, subscribe } from "../../api/paymentApi";
import { SubscriptionType } from "../../types/enums";
import { AnimatedCheckmark } from "../../components/animated/checkmark/AnimatedCheckmark";
import { colors } from "../../theme/colors";
import { useEffect, useState } from "react";
import { enqueueError, enqueueSuccess } from "../../enqueueHelper";
import { useTranslation } from "react-i18next";
import { AddressForm } from "./AddressForm";
import { useMe } from "../../queries/queries";

type Props = {
  type: SubscriptionType;
  handleBack: () => void;
};

export const PlanDetails = ({ type, handleBack }: Props) => {
  return (
    <Container maxWidth="sm">
      {type === SubscriptionType.NO_SUBSCRIPTION ? (
        <DeleteContent handleBack={handleBack} />
      ) : (
        <PaymentComponent handleBack={handleBack} type={type} />
      )}
    </Container>
  );
};
type DeleteProps = {
  handleBack: () => void;
};
const DeleteContent = ({ handleBack }: DeleteProps) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation(deleteSubscription, {
    onSuccess: (data: any) => {
      data.success
        ? enqueueSuccess(t(`messages.success.${data.message}`))
        : enqueueError(t(`messages.errors.${data.message}`)),
        queryClient.invalidateQueries("me");
    },
    onError: (error: any) => enqueueError(error.response.data.message),
  });

  const handleConfirm = async () => {
    await mutateAsync();
    handleBack();
  };
  return (
    <Paper elevation={8} sx={{ padding: 2, marginTop: 4 }}>
      <Typography variant="h5" sx={{ marginBottom: 2 }}>
        {t("subscriptions.delete.title")}
      </Typography>
      <Typography variant="body1" gutterBottom sx={{ marginBottom: 2 }}>
        {t("subscriptions.delete.content")}
      </Typography>
      <Typography variant="body1" gutterBottom sx={{ marginBottom: 2 }}>
        {t("subscriptions.delete.warning")}
      </Typography>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Button onClick={handleBack} color="inherit">
          {t("subscriptions.delete.cancel")}
        </Button>
        <Button onClick={handleConfirm} color="error" variant="contained">
          {t("subscriptions.delete.confirm")}
        </Button>
      </div>
    </Paper>
  );
};
type PaymentProps = {
  type: SubscriptionType;
  handleBack: () => void;
};

const PaymentComponent = ({ type, handleBack }: PaymentProps) => {
  const { t } = useTranslation();
  const { data } = useMe();
  const [successOpen, setSuccessOpen] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const queryClient = useQueryClient();
  const [address, setAddress] = useState<any>({
    country: "",
    postal_code: "",
    city: "",
    line1: "",
  });
  const { mutate, isLoading } = useMutation(subscribe, {
    onSuccess: (data: any) => {
      queryClient.invalidateQueries("me");
      data.success
        ? setSuccessOpen(true)
        : enqueueError(t(`messages.errors.${data.message}`));
    },
    onError: (error: any) =>
      enqueueError(t(`messages.errors.${error.response.data.message}`)),
  });

  const handleSubscription = async () =>
    mutate({
      subscriptionType: type,
      stripe,
      elements,
      address,
    });

  useEffect(() => {
    if (!data) return;
    const { city, country, zipCode, street } = data.user.address;
    setAddress({
      city,
      country,
      postal_code: zipCode,
      line1: street,
    });
  }, [data]);

  return (
    <Container disableGutters>
      <Backdrop
        sx={{
          backdropFilter: "blur(2px)",
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          flexDirection: "column",
        }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
        <Typography variant="h5">
          {t("subscriptions.details.loading")}
        </Typography>
      </Backdrop>
      <Backdrop
        sx={{
          backdropFilter: "blur(2px)",
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          flexDirection: "column",
        }}
        open={successOpen}
        onClick={() => setSuccessOpen(false)}
      >
        {successOpen && (
          <AnimatedCheckmark color={colors.primaryGreen} size="56px" />
        )}
        <Typography variant="h5">
          {t("subscriptions.details.success")}
        </Typography>
      </Backdrop>
      <Typography sx={{ mb: 2 }} variant="h4">
        {t(`subscriptions.details.${type}`)}
      </Typography>
      <Paper elevation={8} sx={{ p: 2, mb: 2 }}>
        <PaymentElement />
        <AddressForm address={address} onAddressChange={setAddress} />
      </Paper>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Button color="inherit" onClick={handleBack}>
          {t("subscriptions.details.cancel")}
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubscription}
          disabled={isLoading}
        >
          {t("subscriptions.details.subscribe")}
        </Button>
      </div>
    </Container>
  );
};
