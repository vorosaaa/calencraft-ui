import { useEffect, useState } from "react";
import { ThemeProvider } from "@mui/material";
import { Header } from "./components/header/Header";
import { customTheme } from "./theme/theme";
import { BookyRoutes } from "./router/Router";
import { useAuth } from "./hooks/authHook";
import { Footer } from "./components/footer/Footer";
import { VerificationModal } from "./pages/verification/Verification";
import { useVerificationModalHook } from "./hooks/verificationHook";
import { CountryCode, VerificationMode } from "./types/enums";
import { generateRandomGradient } from "./utils/headerUtils";
import { useBackgroundHook } from "./hooks/backgroundHook";
import { useValidateToken } from "./queries/queries";
import axios from "axios";
import { useGeoLocation } from "./hooks/locationHook";
import { useLocation } from "react-router-dom";

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
    location.pathname === "/login" || location.pathname === "/register";

  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isRegistrationModalOpen, setRegistrationModalOpen] = useState(false);
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

  const handleLoginModalOpen = () => setLoginModalOpen(true);
  const handleRegistrationModalOpen = () => setRegistrationModalOpen(true);

  return (
    <ThemeProvider theme={customTheme}>
      <div
        style={{
          minHeight: "100vh",
          minWidth: "100vw",
        }}
      >
        {!hideHeaderFooter && (
          <Header
            onLoginClick={handleLoginModalOpen}
            onRegistrationClick={handleRegistrationModalOpen}
          />
        )}
        <BookyRoutes />
        <VerificationModal />

        {!hideHeaderFooter && <Footer />}
      </div>
    </ThemeProvider>
  );
};
