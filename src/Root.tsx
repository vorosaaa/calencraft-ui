import { useEffect } from "react";
import { ThemeProvider } from "@mui/material";
import { Header } from "./components/header/Header";
import { customTheme } from "./theme/theme";
import { BookyRoutes } from "./router/Router";
import { useAuth } from "./hooks/authHook";
import { Footer } from "./components/footer/Footer";
import { useVerificationModalHook } from "./hooks/verificationHook";
import { generateRandomGradient } from "./utils/headerUtils";
import { useBackgroundHook } from "./hooks/backgroundHook";
import { useValidateToken } from "./queries/queries";
import { useLocation } from "react-router-dom";
import ScrollToTopButton from "./components/scrollToTop/ScrollToTopButton";

export const Root = () => {
  const { removeAuth, isLoggedIn } = useAuth();
  useVerificationModalHook();
  const { error } = useValidateToken();

  useEffect(() => {
    if (error) {
      removeAuth();
    }
  }, [error]);

  const location = useLocation();
  const hideHeaderFooter =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/verification";

  const { setBackground } = useBackgroundHook();

  useEffect(() => {
    const randomGradient = generateRandomGradient();
    setBackground(randomGradient);
  }, []);

  return (
    <ThemeProvider theme={customTheme}>
      {!hideHeaderFooter && <Header />}
      <div style={{ minHeight: "100vh" }}>
        <BookyRoutes />
      </div>
      {!hideHeaderFooter && !isLoggedIn() && <Footer />}
      <ScrollToTopButton />
    </ThemeProvider>
  );
};
