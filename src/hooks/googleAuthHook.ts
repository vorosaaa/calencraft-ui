import { useMutation, useQueryClient } from "react-query";
import { googleAuth, verifyGoogleToken } from "../api/authApi";
import {
  GoogleRegistrationData,
  PersonalData,
} from "../types/user";
import { useAuth } from "./authHook";
import { useNavigate } from "react-router-dom";

// Custom Hook to handle Google login
export const useGoogleAuth = () => {
  const { saveAuth } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: continueWithGoogle } = useMutation(googleAuth, {
    onSuccess: (data) => {
      saveAuth(data.token);
      queryClient.invalidateQueries("me");
      navigate("/");
    },
  });

  const handleGoogleLoginSuccess = async (
    credentialResponse: any,
    userType: PersonalData["userType"] | undefined,
    country: PersonalData["country"] | undefined,
  ) => {
    const { credential } = credentialResponse;
    try {
      const googleToken = credentialResponse.credential;
      const response = await verifyGoogleToken(googleToken);

      if (country != undefined && userType != undefined) {
        // Handle successful response (create a new account)
        console.log("Google login successful:");
        const isLogin = false;
        const personalData: PersonalData = {
          loginType: "google",
          name: response.name,
          email: response.email,
          phone: "",
          password: "password", // Placeholder password, since Google login doesn’t need it
          country: country,
          userType: userType,
        };
        const registrationData: GoogleRegistrationData = {
          personalData,
          isLogin,
        };
        // Send personal data to backend via mutation
        continueWithGoogle({
          personalData: registrationData.personalData, // Accessing `personalData` here
          isLogin,
        });
      } else {
        // Try log in the user
        console.log("Google login successful:");
        const isLogin = true;
        const personalData: PersonalData = {
          loginType: "google",
          name: response.name,
          email: response.email,
          phone: "",
          password: "password", // Placeholder password, since Google login doesn’t need it
          country: country,
          userType: "endUser", // Placeholder
        };
        const registrationData: GoogleRegistrationData = {
          personalData,
          isLogin,
        };
        // Send personal data to backend via mutation
        continueWithGoogle({
          personalData: registrationData.personalData, // Accessing `personalData` here
          isLogin,
        });
      }
    } catch (error) {
      console.error("Error during Google login:", error);
    }
  };

  const handleGoogleLoginError = () => {
    console.log("Google login failed");
  };

  return {
    handleGoogleLoginSuccess,
    handleGoogleLoginError,
  };
};
