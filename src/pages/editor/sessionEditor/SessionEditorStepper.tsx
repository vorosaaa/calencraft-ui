import { useState } from "react";
import { useCheckMobileScreen } from "../../../hooks/screenHook";
import { SessionType } from "../../../types/sessionType";
import {
  Container,
  Grid,
  Skeleton,
  Step,
  StepContent,
  StepLabel,
  Stepper,
} from "@mui/material";
import { SessionSelector } from "./firstStep/SessionSelector";
import { Details } from "./thirdStep/Details";
import { useMutation, useQueryClient } from "react-query";
import { deleteType, savesTypes } from "../../../api/providerApi";
import { SessionForm } from "./secondStep/SessionForm";
import { useTranslation } from "react-i18next";
import { RepeatType } from "../../../types/enums";
import { enqueueError, enqueueSuccess } from "../../../enqueueHelper";
import { useMe } from "../../../queries/queries";
import { FormState } from "../../../types/formState";
import { adjustTimes, handleLengthInMinutesChange } from "./sessionEditorUtils";

const initialType = {
  name: "",
  description: "",
  price: 0,
  startTime: "08:00",
  endTime: "18:00",
  lengthInMinutes: 60,
  validFrom: Date.now(),
  generationFrequency: 15,
  maxCapacity: 1,
  days: [],
  repeat: RepeatType.WEEKLY,
};

const steps = [
  "editor.select_session",
  "editor.edit_session",
  "editor.details_session",
];

type Props = { formState: FormState };

export const SessionTypeEditorStepper = ({ formState }: Props) => {
  const queryClient = useQueryClient();
  const isMobile = useCheckMobileScreen();
  const { t } = useTranslation();

  //States
  const [activeStep, setActiveStep] = useState(0);
  const [selectedSession, setSelectedSession] =
    useState<SessionType>(initialType);

  const { data } = useMe();
  const { mutate: deleteSessionType } = useMutation(deleteType, {
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      data.success
        ? enqueueSuccess(t(`messages.success.${data.message}`))
        : enqueueError(t(`messages.errors.${data.message}`));
    },
    onError: (error: any) =>
      enqueueError(t(`messages.errors.${error.response.data.message}`)),
  });
  const { mutate: saveType } = useMutation(savesTypes, {
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      data.success
        ? enqueueSuccess(t(`messages.success.${data.message}`))
        : enqueueError(t(`messages.errors.${data.message}`));
      setActiveStep(0);
    },
    onError: (error: any) =>
      enqueueError(t(`messages.errors.${error.response.data.message}`)),
  });

  //Handlers and functions
  const handleNext = () =>
    setActiveStep((prevActiveStep) => prevActiveStep + 1);

  const handleBack = () =>
    setActiveStep((prevActiveStep) => prevActiveStep - 1);

  const handleAddNew = () => {
    setSelectedSession(initialType);
    handleNext();
  };

  const onSessionClick = (type: SessionType) => {
    setSelectedSession(type);
    handleNext();
  };

  const handleDelete = (type: SessionType) => {
    if (!type.id) return;
    deleteSessionType(type.id);
  };

  const handleSessionDataChange = (
    key: keyof SessionType,
    value: string | number | string[] | RepeatType | null,
    isFixed?: boolean,
  ) => {
    if ((key === "price" || key === "maxCapacity") && Number(value) < 0) return;
    if (key === "startTime" || key === "endTime") {
      const newTimeValue = value as string; // Assuming value is a string in HH:MM format
      const { newStartTime, newEndTime, lengthInMinutes } = adjustTimes(
        key,
        newTimeValue,
        selectedSession,
        !!isFixed,
      );
      setSelectedSession((prevSelectedSession) => ({
        ...prevSelectedSession,
        lengthInMinutes,
        startTime: newStartTime,
        endTime: newEndTime,
      }));
      return;
    }
    if (key === "lengthInMinutes") {
      const { startTime, endTime } = handleLengthInMinutesChange(
        selectedSession,
        Number(value),
      );
      setSelectedSession((prevSelectedSession) => ({
        ...prevSelectedSession,
        lengthInMinutes: Number(value),
        startTime,
        endTime,
      }));
      return;
    }

    setSelectedSession((prevSelectedSession) => ({
      ...prevSelectedSession,
      [key]: value,
    }));
  };

  const handleSubmit = () => saveType(selectedSession);

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <SessionSelector
            sessionTypes={data.user.sessionTypes}
            onDelete={handleDelete}
            onClick={onSessionClick}
            handleAddNew={handleAddNew}
          />
        );
      case 1:
        return (
          <SessionForm
            formState={formState}
            sessionType={selectedSession}
            handleBack={handleBack}
            handleChange={handleSessionDataChange}
            handleNext={handleNext}
          />
        );
      case 2:
        return (
          <Details
            selectedType={selectedSession}
            handleChange={handleSessionDataChange}
            handleBack={handleBack}
            handleSubmit={handleSubmit}
          />
        );
      default:
        return <div>Unknown step</div>;
    }
  };

  if (!data.user.sessionTypes) return <LoadingView />;
  return (
    <Container sx={{ mt: 4 }}>
      <Stepper
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
        {activeStep !== steps.length && !isMobile && getStepContent(activeStep)}
      </div>
    </Container>
  );
};

const LoadingView = () => {
  return (
    <Container maxWidth="sm" sx={{ marginBottom: 2 }}>
      <Grid container spacing={2}>
        <Skeleton
          sx={{ marginTop: 2, marginBottom: 2 }}
          variant="rounded"
          animation="pulse"
          width={"100%"}
          height={60}
        />
        <Skeleton
          sx={{ marginBottom: 2 }}
          variant="rounded"
          animation="pulse"
          width={"100%"}
          height={60}
        />
        <Skeleton
          sx={{ marginBottom: 2 }}
          variant="rounded"
          animation="pulse"
          width={"100%"}
          height={60}
        />
      </Grid>
    </Container>
  );
};
