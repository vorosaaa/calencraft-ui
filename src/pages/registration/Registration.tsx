import React, { useEffect, useState } from "react";
import { Typography, Grid, CssBaseline } from "@mui/material";
import { register } from "../../api/authApi";
import { useMutation, useQueryClient } from "react-query";
import { useAuth } from "../../hooks/authHook";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { PersonalData } from "../../types/user";
import { UserTypeSelector } from "./UserTypeSelector";
import { GridContent } from "./GridContent";
import { RegistrationFooter } from "./RegistrationFooter";
import { CustomCarousel } from "../../components/auth/CustomCarousel";
import { useGeoLocation } from "../../hooks/locationHook";
import { useVerificationModalHook } from "../../hooks/verificationHook";
import { VerificationMode } from "../../types/enums";
import { useCheckMobileScreen } from "../../hooks/screenHook";

export type FormState = {
  confirmPassword: string;
  accepted: boolean;
} & PersonalData;

export type ErrorState = {
  passwordEmpty: boolean;
  passwordMatch: boolean;
  passwordComplexity: boolean;
  nameEmpty: boolean;
  emailEmpty: boolean;
  invalidEmailFormat: boolean;
};

const initialError: ErrorState = {
  passwordComplexity: false,
  passwordEmpty: false,
  passwordMatch: false,
  nameEmpty: false,
  emailEmpty: false,
  invalidEmailFormat: false,
};

const initialFormState: FormState = {
  userType: "endUser",
  name: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  accepted: false,
};

export const RegistrationForm = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { saveAuth } = useAuth();
  const { setVerification } = useVerificationModalHook();
  const isMobile = useCheckMobileScreen();
  const { location } = useGeoLocation();

  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [error, setError] = useState<ErrorState>(initialError);
  const [currentStep, setCurrentStep] = useState(1); // 1 for select, 2 for form

  const { mutate } = useMutation(register, {
    onSuccess: (data) => {
      setFormState(initialFormState);
      saveAuth(data.token);
      queryClient.invalidateQueries("me");
      setVerification(
        VerificationMode.VERIFICATION,
        VerificationMode.VERIFICATION,
      );
      navigate("/verification");
    },
  });

  const handleUserTypeClick = (value: "endUser" | "provider") => {
    setFormState({
      ...formState,
      userType: value,
    });
    setCurrentStep(2);
  };

  const handleBack = () => setCurrentStep(1);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    checked?: boolean,
  ) => {
    const { name, value } = event.target;
    if (name === "accepted") {
      setFormState({
        ...formState,
        [name]: !!checked,
      });
      return;
    }
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleSubmit = () => {
    const { password, confirmPassword, email, name } = formState;

    const hasEmptyFields = !password || !email || !name;
    const isPasswordSimple = !validatePassword(password);
    const isPasswordMismatch = password !== confirmPassword;
    const isInvalidEmailFormat = !validateEmail(email);

    if (hasEmptyFields) {
      setError({
        passwordEmpty: !password,
        emailEmpty: !email,
        nameEmpty: !name,
        passwordComplexity: isPasswordSimple,
        passwordMatch: isPasswordMismatch,
        invalidEmailFormat: isInvalidEmailFormat,
      });
    } else if (isPasswordSimple || isPasswordMismatch) {
      setError({
        passwordEmpty: false,
        emailEmpty: false,
        nameEmpty: false,
        passwordComplexity: isPasswordSimple,
        passwordMatch: isPasswordMismatch,
        invalidEmailFormat: isInvalidEmailFormat,
      });
    } else {
      setError(initialError);
      mutate({
        personalData: formState,
      });
    }
  };

  useEffect(() => {
    setFormState({ ...formState, country: location.searchCountry });
  }, [location]);

  return (
    <Grid container spacing={0}>
      <CssBaseline />

      <Grid
        sx={{
          paddingLeft: isMobile ? 2 : 8,
          paddingRight: isMobile ? 2 : 8,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
        item
        xs={12}
        md={4}
      >
        <Typography variant="h5" align="left" sx={{ mb: 4 }}>
          {t("registration.title")}
        </Typography>
        {currentStep === 1 && (
          <UserTypeSelector
            formState={formState}
            handleUserTypeClick={handleUserTypeClick}
          />
        )}
        {currentStep === 2 && (
          <GridContent
            formState={formState}
            error={error}
            handleInputChange={handleInputChange}
          />
        )}
        <RegistrationFooter
          form={formState}
          currentStep={currentStep}
          handleBack={handleBack}
          handleSubmit={handleSubmit}
        />
      </Grid>
      <Grid item xs={0} md={8}>
        <CustomCarousel />
      </Grid>
    </Grid>
  );
};

const validateEmail = (email: string) => {
  return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    email,
  );
};

const validatePassword = (password: string): boolean => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  return passwordRegex.test(password);
};
