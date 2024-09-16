import React, { useEffect, useState } from "react";
import { Typography, Grid, CssBaseline } from "@mui/material";
import { register } from "../../api/authApi";
import { useMutation, useQueryClient } from "react-query";
import { useAuth } from "../../hooks/authHook";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { PersonalData } from "../../types/user";
import { UserTypeSelector } from "./UserTypeSelector";
import { GridContent } from "./GridContent";
import { RegistrationFooter } from "./RegistrationFooter";
import Carousel from "react-material-ui-carousel";

type Props = {
  navigateToVerification: () => void;
};

const carouselImages = [
  "/images/barber.jpeg",
  "/images/fitness.jpeg",
  "/images/cosmetics.jpeg",
];

const CarouselCard = ({ src }: { src: string }) => (
  <img
    src={src}
    alt="carousel"
    style={{ width: "100%", height: "100%", objectFit: "cover" }}
  />
);

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

export const RegistrationForm = ({ navigateToVerification }: Props) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { saveAuth } = useAuth();

  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [error, setError] = useState<ErrorState>(initialError);
  const [currentStep, setCurrentStep] = useState(1); // 1 for select, 2 for form

  const { mutate } = useMutation(register, {
    onSuccess: (data) => {
      setFormState(initialFormState);
      saveAuth(data.token);
      queryClient.invalidateQueries("me");
      navigate("/myprofile");
      navigateToVerification();
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
    axios
      .get("https://ipapi.co/json/")
      .then((response: any) =>
        setFormState({ ...formState, country: response.data.country_code }),
      );
  }, []);

  return (
    <Grid container spacing={0}>
      <CssBaseline />

      <Grid
        sx={{
          paddingLeft: 8,
          paddingRight: 8,
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
        <Carousel
          autoPlay={true}
          interval={5000}
          duration={1000}
          animation="slide"
          height={"100vh"}
          indicators={false}
        >
          {carouselImages.map((src, index) => (
            <CarouselCard key={index} src={src} />
          ))}
        </Carousel>
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
