import {
  useStripe,
  useElements,
  PaymentElement,
  Elements,
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
import { useMe } from "../../queries/queries";
import { AddressAccordionContent } from "../editor/accordions/AddressAccordionContent";
import { Address } from "../../types/user";
import { loadStripe } from "@stripe/stripe-js";
import { config } from "../../config/config";

type Props = {
  type: SubscriptionType;
  handleBack: () => void;
};

const stripePromise = loadStripe(config.STRIPE_PUBLIC_KEY);

export const PlanDetails = ({ type, handleBack }: Props) => {
  let amount = config.SUBSCRIPTION_AMOUNTS[type];
  if (typeof amount === "string") {
    amount = parseInt(amount.replace(/\./g, ""), 10);
  }
  amount *= 100;

  if (isNaN(amount) || amount < 0) {
    throw new Error("Invalid subscription amount");
  }
  return (
    <Elements
      stripe={stripePromise}
      options={{
        mode: "payment",
        currency: "huf",
        amount,
        setup_future_usage: "off_session",
      }}
    >
      <Container maxWidth="sm">
        {type === SubscriptionType.NO_SUBSCRIPTION ? (
          <DeleteContent handleBack={handleBack} />
        ) : (
          <PaymentComponent handleBack={handleBack} type={type} />
        )}
      </Container>
    </Elements>
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
  const [address, setAddress] = useState<Address | undefined>();
  const [hasMissingFields, setHasMissingFields] = useState(false);

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

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const addressField = name.split(".")[1];
    setAddress({ ...address, [addressField]: value });
  };

  const checkForMissingFields = () => {
    return (
      !address?.country ||
      !address?.zipCode ||
      !address?.city ||
      !address?.street
    );
  };

  const handleSubscription = async () => {
    if (!stripe || !elements || !address) return;
    if (checkForMissingFields()) {
      setHasMissingFields(true);
      return;
    }
    mutate({
      subscriptionType: type,
      stripe,
      elements,
      address,
    });
  };
  useEffect(() => {
    if (!data) return;
    const { city, country, zipCode, street } = data.user.billingAddress
      ? data.user.billingAddress
      : data.user.address;
    setAddress({
      city,
      country,
      zipCode,
      street,
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
        <PaymentElement
          options={{
            fields: { billingDetails: { address: { country: "never" } } },
          }}
        />
        {address && (
          <Container disableGutters sx={{ mt: 3 }}>
            <AddressAccordionContent
              name="address"
              address={address}
              hasMissingFields={hasMissingFields}
              handleInputChange={handleAddressChange}
            />
          </Container>
        )}
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
