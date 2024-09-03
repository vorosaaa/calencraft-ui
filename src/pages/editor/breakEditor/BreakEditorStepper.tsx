import { useState } from "react";
import { useCheckMobileScreen } from "../../../hooks/screenHook";
import {
  Container,
  Grid,
  Skeleton,
  Step,
  StepContent,
  StepLabel,
  Stepper,
} from "@mui/material";
import { useMutation, useQueryClient } from "react-query";
import { deleteBreak, saveBreaks } from "../../../api/providerApi";
import { useTranslation } from "react-i18next";
import { BreakSelector } from "./firstStep/BreakSelector";
import { BreakStateType } from "../../../types/breakStateType";
import { BreakForm } from "./secondStep/BreakForm";
import { Details } from "./thirdStep/Details";
import { enqueueError, enqueueSuccess } from "../../../enqueueHelper";
import { BreakType, RepeatType } from "../../../types/enums";
import { useMe } from "../../../queries/queries";

const initialType = {
  name: "",
  from: new Date().getTime(),
  to: new Date().getTime(),
  startTime: "10:00",
  endTime: "10:15",
  days: [],
  repeat: RepeatType.WEEKLY,
  type: BreakType.REGULAR,
};

const steps = [
  "editor.select_break",
  "editor.edit_break",
  "editor.details_break",
];

export const BreakEditorStepper = () => {
  const queryClient = useQueryClient();
  const isMobile = useCheckMobileScreen();
  const { t } = useTranslation();

  //States
  const [activeStep, setActiveStep] = useState(0);
  const [selectedBreak, setSelectedBreak] =
    useState<BreakStateType>(initialType);

  const { data } = useMe();
  const { mutate: deleteBreakType } = useMutation(deleteBreak, {
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      data.success
        ? enqueueSuccess(t(`messages.success.${data.message}`))
        : enqueueError(t(`messages.errors.${data.message}`));
    },
    onError: (error: any) =>
      enqueueError(t(`messages.errors.${error.response.data.message}`)),
  });
  const { mutate } = useMutation(saveBreaks, {
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
    setSelectedBreak(initialType);
    handleNext();
  };

  const onBreakSelect = (br: BreakStateType) => {
    setSelectedBreak(br);
    handleNext();
  };

  const handleBreakChange = (
    key: keyof BreakStateType,
    value?: string | number | BreakType | RepeatType | string[] | null,
  ) => {
    // Directly access the current state outside of setSelectedBreak
    const currentFrom = selectedBreak.from;
    const currentTo = selectedBreak.to;

    if (
      key === "from" &&
      typeof value === "number" &&
      value > (currentTo || 0)
    ) {
      // If 'from' is being updated to a value greater than 'to', set both to the new 'from' value
      setSelectedBreak((prevSelectedBreak) => ({
        ...prevSelectedBreak,
        from: value,
        to: value,
      }));
      return; // Exit the function early
    } else if (
      key === "to" &&
      typeof value === "number" &&
      value < (currentFrom || 0)
    ) {
      // If 'to' is being updated to a value less than 'from', set both to the new 'to' value
      setSelectedBreak((prevSelectedBreak) => ({
        ...prevSelectedBreak,
        from: value,
        to: value,
      }));
      return; // Exit the function early
    } else if (
      (key === "startTime" || key === "endTime") &&
      typeof value === "string" &&
      selectedBreak.type === "REGULAR"
    ) {
      // Ensure startTime is not greater than endTime for REGULAR type
      const startTime = key === "startTime" ? value : selectedBreak.startTime;
      const endTime = key === "endTime" ? value : selectedBreak.endTime;

      if (
        startTime &&
        endTime &&
        timeToMinutes(startTime) > timeToMinutes(endTime)
      ) {
        const unifiedTime = key === "startTime" ? startTime : endTime;
        setSelectedBreak((prevSelectedBreak) => ({
          ...prevSelectedBreak,
          startTime: unifiedTime,
          endTime: unifiedTime,
        }));
        return; // Prevent update and exit function early
      }
    }
    setSelectedBreak((prevSelectedBreak) => ({
      ...prevSelectedBreak,
      [key]: value,
    }));
  };
  const handleDelete = (br: BreakStateType) => {
    if (!br.id) return;
    deleteBreakType(br.id);
  };

  const handleSubmit = () => mutate(selectedBreak);

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <BreakSelector
            breaks={data.user.breaks}
            onDelete={handleDelete}
            onClick={onBreakSelect}
            handleAddNew={handleAddNew}
          />
        );
      case 1:
        return (
          <BreakForm
            breakState={selectedBreak}
            handleBack={handleBack}
            handleChange={handleBreakChange}
            handleNext={handleNext}
          />
        );
      case 2:
        return (
          <Details
            breakState={selectedBreak}
            handleChange={handleBreakChange}
            handleBack={handleBack}
            handleSubmit={handleSubmit}
          />
        );
      default:
        return <div>Unknown step</div>;
    }
  };

  if (!data.user.breaks) return <LoadingView />;
  return (
    <Container sx={{ mt: 2 }}>
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

const timeToMinutes = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};
