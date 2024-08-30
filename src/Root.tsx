import { useEffect, useState } from "react";
import { Login } from "./pages/login/Login";
import { RegistrationForm } from "./pages/registration/Registration";
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
import { useLocation } from "./hooks/locationHook";

export const Root = () => {
  const { removeAuth } = useAuth();
  const { setVerification } = useVerificationModalHook();
  useValidateToken({
    onError: () => {
      removeAuth();
    },
  });

  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isRegistrationModalOpen, setRegistrationModalOpen] = useState(false);
  const { setBackground } = useBackgroundHook();
  const { setSearchCountry, setSearchCity, setIsLoading } = useLocation();

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
  const handleLoginModalClose = () => setLoginModalOpen(false);
  const handleRegistrationModalOpen = () => setRegistrationModalOpen(true);
  const handleRegistrationModalClose = () => setRegistrationModalOpen(false);

  const navigateToRegFromLogin = () => {
    handleLoginModalClose();
    handleRegistrationModalOpen();
  };
  const navigateToValidationFromReg = () => {
    setVerification(
      true,
      VerificationMode.VERIFICATION,
      VerificationMode.VERIFICATION,
    );
  };

  return (
    <ThemeProvider theme={customTheme}>
      <Header
        onLoginClick={handleLoginModalOpen}
        onRegistrationClick={handleRegistrationModalOpen}
      />
      <div
        style={{
          minHeight: "100vh",
        }}
      >
        <BookyRoutes />
      </div>
      {/********* Modals *********/}
      <Login
        open={isLoginModalOpen}
        handleClose={handleLoginModalClose}
        onRegistrationClick={navigateToRegFromLogin}
      />

      <RegistrationForm
        open={isRegistrationModalOpen}
        handleClose={handleRegistrationModalClose}
        navigateToVerification={navigateToValidationFromReg}
      />

      <VerificationModal />

      {/* Add Footer component */}
      <Footer />
    </ThemeProvider>
  );
};
