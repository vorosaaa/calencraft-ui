import React, { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import { register } from "../../api/authApi";
import { useMutation, useQueryClient } from "react-query";
import { useAuth } from "../../hooks/authHook";
import { GridContent } from "./GridContent";
import { RegistrationFooter } from "./RegistrationFooter";
import { UserTypeSelector } from "./UserTypeSelector";
import { useCheckMobileScreen } from "../../hooks/screenHook";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { PersonalData } from "../../types/user";

type Props = {
  open: boolean;
  handleClose: () => void;
  navigateToVerification: () => void;
};

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

export const RegistrationForm = ({
  open,
  handleClose,
  navigateToVerification,
}: Props) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const isMobile = useCheckMobileScreen();
  const navigate = useNavigate();
  const { saveAuth } = useAuth();

  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [error, setError] = useState<ErrorState>(initialError);
  const [currentStep, setCurrentStep] = useState(1); // 1 for select, 2 for form

  const { mutate } = useMutation(register, {
    onSuccess: (data) => {
      setFormState(initialFormState);
      saveAuth(data.token);
      handleClose();
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
    <Dialog
      open={open}
      onClose={handleClose}
      fullScreen={isMobile}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle sx={{ padding: 4 }} variant="h4" align="center">
        {t("registration.title")}
      </DialogTitle>
      <DialogContent>
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
      </DialogContent>
      <RegistrationFooter
        currentStep={currentStep}
        handleClose={handleClose}
        handleBack={handleBack}
        handleSubmit={handleSubmit}
      />
    </Dialog>
  );
};

const validateEmail = (email: string) => {
  return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    email,
  );
};

export const validatePassword = (password: string): boolean => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d.,-]{8,}$/;
  return passwordRegex.test(password);
};
