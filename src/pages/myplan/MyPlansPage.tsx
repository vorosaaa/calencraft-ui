// StepperPage.tsx
import { useEffect, useState } from "react";
import { Stepper, Container } from "@mui/material";
import { Plans } from "./Plans";
import { SubscriptionType } from "../../types/enums";
import { PlanDetails } from "./PlanDetails";
import { StripeElementsOptions, loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/authHook";

const stripePromise = loadStripe(
  process.env.REACT_APP_STRIPE_PUBLIC_KEY || "public",
);
const options: StripeElementsOptions = {
  mode: "setup",
  currency: "huf",
};

export const MyPlansPage = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [selectedType, setSelectedType] = useState(
    SubscriptionType.NO_SUBSCRIPTION,
  );

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/");
    }
  }, [isLoggedIn]);

  const handleNext = (type: SubscriptionType) => {
    setSelectedType(type);
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <Plans handleNext={handleNext} />;
      case 1:
        return (
          <Elements stripe={stripePromise} options={options}>
            <PlanDetails type={selectedType} handleBack={handleBack} />
          </Elements>
        );
      // Add more cases for additional steps
      default:
        return "Unknown step";
    }
  };
  return (
    <Container maxWidth="lg" disableGutters sx={{ pt: 2 }}>
      <Stepper activeStep={activeStep} />
      <Container>
        {getStepContent(activeStep)}
        {activeStep === 1 && (
          <Container
            sx={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 2,
            }}
          ></Container>
        )}
      </Container>
    </Container>
  );
};
