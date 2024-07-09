export const config = {
  NAME: "Calencraft",
  SERVER_URL: process.env.REACT_APP_SERVER_URL || "http://localhost:8080",
  MODE: process.env.REACT_APP_NODE_ENV || "development",
  STRIPE_PUBLIC_KEY: process.env.REACT_APP_STRIPE_PUBLIC_KEY || "public",
};
