import { useEffect } from "react";
import { ThemeProvider } from "@mui/material";
import { Header } from "./components/header/Header";
import { customTheme } from "./theme/theme";
import { BookyRoutes } from "./router/Router";
import { useAuth } from "./hooks/authHook";
import { Footer } from "./components/footer/Footer";
import { useVerificationModalHook } from "./hooks/verificationHook";
import { CountryCode } from "./types/enums";
import { generateRandomGradient } from "./utils/headerUtils";
import { useBackgroundHook } from "./hooks/backgroundHook";
import { useValidateToken } from "./queries/queries";
import axios from "axios";
import { useGeoLocation } from "./hooks/locationHook";
import { useLocation } from "react-router-dom";
import ScrollToTopButton from "./components/scrollToTop/ScrollToTopButton";

export const Root = () => {
  const { removeAuth } = useAuth();
  useVerificationModalHook();
  useValidateToken({
    onError: () => {
      removeAuth();
    },
  });

  const location = useLocation();
  const hideHeaderFooter =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/verification";

  const { setBackground } = useBackgroundHook();
  const { setSearchCountry, setSearchCity, setIsLoading } = useGeoLocation();

  useEffect(() => {
    axios
      .get("https://ipapi.co/json/")
      .then((response: any) => {
        if (response.data.country_code in CountryCode) {
          setSearchCountry(response.data.country_code);
        }
        if (response.data.city) {
          setSearchCity(response.data.city);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });

    const randomGradient = generateRandomGradient();
    setBackground(randomGradient);
  }, []);

  return (
    <ThemeProvider theme={customTheme}>
      {!hideHeaderFooter && <Header />}
      <div style={{ minHeight: "100vh" }}>
        <BookyRoutes />
      </div>
      {!hideHeaderFooter && <Footer />}
      <ScrollToTopButton />
    </ThemeProvider>
  );
};
