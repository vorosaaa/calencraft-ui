import { Stripe, StripeElements } from "@stripe/stripe-js";
import { SubscriptionType } from "../types/enums";
import axiosClient from "./axiosClient";
import { Address } from "../types/user";

type SubscriptionProp = {
  subscriptionType: SubscriptionType;
  elements: StripeElements | null;
  stripe: Stripe | null;
  address: Address;
};

const getPaymentIntentSecret = async (subscriptionType: SubscriptionType) => {
  const paymentIntentResponse = await axiosClient.post(
    "api/payment/create-intent",
    {
      subscriptionType,
    },
  );

  const { client_secret, payment_method } =
    paymentIntentResponse.data.resultList[0];

  if (!client_secret) {
    throw new Error("Failed to retrieve PaymentIntent details");
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

  try {
    // Trigger form validation and wallet collection
    const { error: submitError } = await elements.submit();
    if (submitError) {
      throw new Error("Failed to submit");
    }
    // Get the client secret for the setup intent
    const { client_secret } = await getPaymentIntentSecret(subscriptionType);

    // Use the clientSecret and Elements instance to confirm the setup
    const { paymentIntent, error } = await stripe.confirmPayment({
      elements,
      clientSecret: client_secret,
      confirmParams: {
        return_url: "https://calencraft.com",
        payment_method_data: {
          billing_details: {
            address: {
              country: address.country,
            },
          },
        },
      },
      redirect: "if_required",
    });
    if (error) {
      throw new Error("Failed to confirm Payment");
    }

    // Prepare the request body for subscription creation
    const body = {
      subscriptionType,
      intentId: paymentIntent.id,
      address,
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
  return { success: false, message: "FAILED_TO_SUBSCRIBE" };
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
