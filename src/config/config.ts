export const config = {
  NAME: "Calencraft",
  SERVER_URL: process.env.REACT_APP_SERVER_URL || "http://localhost:8080",
  MODE: process.env.REACT_APP_NODE_ENV || "development",
  STRIPE_PUBLIC_KEY: process.env.REACT_APP_STRIPE_PUBLIC_KEY || "public",
  SUBSCRIPTION_AMOUNTS: {
    STANDARD: process.env.REACT_APP_STANDARD_PRICE || 1000,
    PROFESSIONAL: process.env.REACT_APP_PROFESSIONAL_PRICE || 5000,
    NO_SUBSCRIPTION: process.env.REACT_APP_NO_SUBSCRIPTION_PRICE || 1,
  },
};
