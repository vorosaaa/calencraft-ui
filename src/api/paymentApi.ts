import { Stripe, StripeElements } from "@stripe/stripe-js";
import { SubscriptionType } from "../types/enums";
import axiosClient from "./axiosClient";

type SubscriptionProp = {
  subscriptionType: SubscriptionType;
  elements: StripeElements | null;
  stripe: Stripe | null;
  address: {
    city: string;
    country: string;
    postal_code: string;
    line1: string;
  };
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
  address,
}: SubscriptionProp) => {
  // Check if elements and stripe are initialized
  if (!elements || !stripe) throw new Error("Wrong init values");
  const addr = {
    city: address.city,
    country: address.country,
    zipCode: address.postal_code,
    street: address.line1,
  };

  try {
    // Trigger form validation and wallet collection
    const { error: submitError } = await elements.submit();
    if (submitError) {
      throw new Error("Failed to submit");
    }
    // Get the client secret for the setup intent
    const { client_secret } = await getSecret();

    // Use the clientSecret and Elements instance to confirm the setup
    const { setupIntent, error } = await stripe.confirmSetup({
      elements,
      clientSecret: client_secret,
      confirmParams: {
        return_url: "https://calencraft.com",
      },
      redirect: "if_required",
    });
    if (error) {
      throw new Error("Failed to confirm SetupIntent");
    }

    // Prepare the request body for subscription creation
    const body = {
      subscriptionType,
      setupIntentId: setupIntent.id,
      address: addr,
    };

    // Send a request to create the subscription
    const { data: subscriptionData } = await axiosClient.post(
      `api/payment`,
      body,
    );

    // Check if the subscription creation was successful
    if (!subscriptionData) {
      throw new Error("Failed to create subscription");
    }

    // Return the subscription data
    return subscriptionData;
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
