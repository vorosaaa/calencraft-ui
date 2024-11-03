export const config = {
  NAME: "Calencraft",
  SERVER_URL: import.meta.env.VITE_SERVER_URL || "http://localhost:8080",
  MODE: import.meta.env.VITE_NODE_ENV || "development",
  STRIPE_PUBLIC_KEY: import.meta.env.VITE_STRIPE_PUBLIC_KEY || "public",
  GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID || "googleclientid",
  SUBSCRIPTION_AMOUNTS: {
    STANDARD: import.meta.env.VITE_STANDARD_PRICE || 1000,
    PROFESSIONAL: import.meta.env.VITE_PROFESSIONAL_PRICE || 5000,
    NO_SUBSCRIPTION: import.meta.env.VITE_NO_SUBSCRIPTION_PRICE || 1,
    TRIAL: import.meta.env.VITE_TRIAL_PRICE || 1,
  },
};
