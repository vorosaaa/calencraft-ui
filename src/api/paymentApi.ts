import { Stripe, StripeElements } from "@stripe/stripe-js";
import { SubscriptionType } from "../types/enums";
import axiosClient from "./axiosClient";

type SubscriptionProp = {
  subscriptionType: SubscriptionType;
  elements: StripeElements | null;
  stripe: Stripe | null;
};

const getSecret = async () => {
  const setupIntentResponse = await axiosClient.get("api/payment/setup");

  const { client_secret, payment_method } =
    setupIntentResponse.data.resultList[0];

  if (!client_secret) {
    throw new Error("Failed to retrieve SetupIntent details");
  }

  return { client_secret, payment_method };
};

export const subscribe = async ({
  subscriptionType,
  elements,
  stripe,
}: SubscriptionProp) => {
  if (!elements || !stripe) throw new Error("Wrong init values");

  try {
    // Trigger form validation and wallet collection
    const { error: submitError } = await elements.submit();
    if (submitError) {
      throw new Error("Failed to submit");
    }

    const { client_secret } = await getSecret();
    // Use the clientSecret and Elements instance to confirm the setup
    const { setupIntent, error } = await stripe.confirmSetup({
      elements,
      clientSecret: client_secret,
      confirmParams: {
        return_url: "https://example.com",
      },
      redirect: "if_required",
    });
    if (error) {
      throw new Error("Failed to confirm SetupIntent");
    }

    const body = {
      subscriptionType,
      setupIntentId: setupIntent.id,
    };
    const subscriptionResponse = await axiosClient.post(`api/payment`, body);

    if (!subscriptionResponse.data) {
      throw new Error("Failed to create subscription");
    }

    return subscriptionResponse.data;
  } catch (error) {
    console.error(error);
  }
  return { success: false, message: "Failed to subscribe" };
};

export const deleteSubscription = async () => {
  try {
    const subscriptionResponse = await axiosClient.delete(`api/payment`);

    if (!subscriptionResponse.data) {
      throw new Error("Failed to create subscription");
    }

    return subscriptionResponse.data;
  } catch (error) {
    console.error(error);
  }
  return { success: false, message: "Failed to cancel subscription" };
};
