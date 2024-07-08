import { Box, Step, StepContent, StepLabel, Stepper } from "@mui/material";
import { useEffect, useState } from "react";
import { SessionSelector } from "./firstStep/SessionSelector";
import { useCheckMobileScreen } from "../../../../hooks/screenHook";
import { SessionType } from "../../../../types/sessionType";
import { DateSelector } from "./secondStep/DateSelector";
import { UserForm } from "./thirdStep/UserForm";
import { VerificationPage } from "./fourthStep/Verification";
import { confirmBooking } from "../../../../api/bookingApi";
import { UserProfile } from "../../../../types/user";
import { useMutation } from "react-query";
import { useTranslation } from "react-i18next";
import {
  enqueueError,
  enqueueSuccess,
  enqueueWarning,
} from "../../../../enqueueHelper";
import { UserState } from "../../../../types/userState";
import { BookingState } from "../../../../types/booking";
import { useMe } from "../../../../queries/queries";

type Props = {
  provider: UserProfile;
};

const steps = [
  "profile.firstStep.title",
  "profile.secondStep.title",
  "profile.thirdStep.title",
  "profile.fourthStep.title",
];

const initialBooking = {
  selectedDate: undefined,
  selectedStartTime: undefined,
  selectedSession: undefined,
};

const initialForm = { name: "", email: "", phoneNumber: "" };

export const BookingStepper = ({ provider }: Props) => {
  const { t } = useTranslation();
  const isMobile = useCheckMobileScreen();

  const [activeStep, setActiveStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const [bookingState, setBookingState] =
    useState<BookingState>(initialBooking);
  const [formData, setFormData] = useState<UserState>(initialForm);

  //Queries
  const { data } = useMe();

  useEffect(() => {
    if (data) {
      setFormData({
        name: data.user.name,
        email: data.user.email,
        phoneNumber: data.user.phoneNumber || "",
      });
    }
  }, [data]);

  //Mutations
  const { mutate, isLoading } = useMutation(confirmBooking, {
    onSuccess: (data: any) => {
      setActiveStep(0);
      setSelectedDate(new Date());
      setBookingState(initialBooking);
      setFormData(initialForm);
      data.success
        ? enqueueSuccess(t(`messages.success.${data.message}`))
        : enqueueError(t(`messages.errors.${data.message}`));
    },
    onError: (error: any) => {
      if (error.response.data.message === "EMAIL_FAILED") {
        enqueueWarning(t("messages.warnings.BOOKING_SUCCESSFUL_EMAIL_FAILED"));
        return;
      }
      enqueueError(t(`messages.errors.${error.response.data.message}`));
    },
  });

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const onSessionClick = (type: SessionType) => {
    const closestDay = getClosestDay(new Date().getDay(), type.days);
    setBookingState((prevState) => ({
      ...prevState,
      selectedSession: type,
    }));
    setSelectedDate(closestDay);
    handleNext();
  };

  const onTimeSelection = (date?: Date, startTime?: string) => {
    setBookingState({
      selectedDate: date,
      selectedStartTime: startTime,
      selectedSession: bookingState.selectedSession,
    });
  };

  const handleUserFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const isUserFormFilled =
    !!formData.email.length &&
    !!formData.name.length &&
    !!formData.phoneNumber.length;
  const handleUserFormNext = () => {
    if (!isUserFormFilled) {
      enqueueError(t("messages.errors.MISSING_INFORMATION"));
      return;
    }
    handleNext();
  };

  const handleConfirmation = () => {
    if (
      !bookingState.selectedDate ||
      !bookingState.selectedStartTime ||
      !bookingState.selectedSession
    )
      return;
    mutate({
      providerId: provider.id,
      date: bookingState.selectedDate.getTime(),
      startTime: bookingState.selectedStartTime,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      sessionId: bookingState.selectedSession.id!,
      name: formData.name,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
    });
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <SessionSelector
            sessionTypes={provider.sessionTypes}
            onClick={onSessionClick}
          />
        );
      case 1:
        return (
          <DateSelector
            provider={provider}
            booking={bookingState}
            allSessionTypes={provider.sessionTypes}
            onClick={onTimeSelection}
            handleNext={handleNext}
            handleBack={handleBack}
            date={selectedDate}
            onDateClick={setSelectedDate}
          />
        );
      case 2:
        return (
          <UserForm
            userState={formData}
            handleChange={handleUserFormChange}
            handleBack={handleBack}
            handleNext={handleUserFormNext}
          />
        );
      case 3:
        return (
          <VerificationPage
            bookingState={bookingState}
            formData={formData}
            onBack={handleBack}
            onConfirm={handleConfirmation}
            isLoading={isLoading}
          />
        );
      default:
        return <div>Unknown step</div>;
    }
  };

  return (
    <Box>
      <Stepper
        sx={{ width: "100%" }}
        activeStep={activeStep}
        alternativeLabel
        orientation={isMobile ? "vertical" : "horizontal"}
      >
        {steps.map((label) => (
          <Step sx={{ width: "100%" }} key={label}>
            <StepLabel sx={{ border: 0 }}>{t(label)}</StepLabel>
            {isMobile && (
              <StepContent
                sx={{
                  margin: 0,
                  padding: 0,
                  border: 0,
                }}
              >
                {getStepContent(activeStep)}
              </StepContent>
            )}
          </Step>
        ))}
      </Stepper>
      <div>
        {activeStep !== steps.length && !isMobile && (
          <div>{getStepContent(activeStep)}</div>
        )}
      </div>
    </Box>
  );
};

const getClosestDay = (currentDay: number, availableDays: string[]): Date => {
  const daysOfWeek = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  const availableDaysIndices = availableDays.map((day) =>
    daysOfWeek.indexOf(day.toLowerCase()),
  );

  for (let i = 0; i < 7; i++) {
    const potentialDay = (currentDay + i) % 7;
    if (availableDaysIndices.includes(potentialDay)) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      return date;
    }
  }

  // If no available day is found, return the current date
  return new Date();
};
