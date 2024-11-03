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
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        axios
          .get(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          )
          .then((response: any) => {
            const location = response.data.address;
            const city = location.city || location.town || location.village;
            const country = location.country_code?.toUpperCase();

            if (country in CountryCode) {
              setSearchCountry(country);
            }
            if (city) {
              setSearchCity(city);
            }
          })
          .finally(() => {
            setIsLoading(false);
          });
      });
    }

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
