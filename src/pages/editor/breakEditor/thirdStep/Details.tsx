import { Button, Container, Grid, TextField, Typography } from "@mui/material";
import { DayButton } from "../../../../components/DayButton";
import { BreakStateType } from "../../../../types/breakStateType";
import { useTranslation } from "react-i18next";
import { NavigatorContainer } from "../../css/ProfileEditor.css";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { BreakType, RepeatType } from "../../../../types/enums";

const days = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

type Props = {
  breakState: BreakStateType;
  handleBack: () => void;
  handleSubmit: () => void;
  handleChange: (
    key: keyof BreakStateType,
    value?: string | number | BreakType | RepeatType | string[] | null,
  ) => void;
};

export const Details = ({
  breakState,
  handleBack,
  handleChange,
  handleSubmit,
}: Props) => {
  const { t } = useTranslation();
  return (
    <Container sx={{ mt: 2 }}>
      {breakState.type === BreakType.REGULAR ? (
        <RegularDetails breakState={breakState} handleChange={handleChange} />
      ) : (
        <TemporaryDetails breakState={breakState} handleChange={handleChange} />
      )}
      <NavigatorContainer>
        <Button
          variant="outlined"
          color="primary"
          onClick={handleBack}
          sx={{ marginBottom: 2 }}
        >
          {t("editor.back")}
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          sx={{ marginBottom: 2 }}
        >
          {t("editor.submit")}
        </Button>
      </NavigatorContainer>
    </Container>
  );
};

type DetailsProps = {
  breakState: BreakStateType;
  handleChange: (
    key: keyof BreakStateType,
    value?: string | number | BreakType | RepeatType | string[] | null,
  ) => void;
};

const RegularDetails = ({ breakState, handleChange }: DetailsProps) => {
  const { t } = useTranslation();

  const onDayClick = (day: string) => {
    let days: string[] = [];
    if (breakState.days?.length) days = breakState.days;

    if (days.includes(day)) {
      handleChange(
        "days",
        days.filter((actualDay) => actualDay !== day),
      );
    } else {
      handleChange("days", [...days, day]);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", marginBottom: 24 }}>
      <div>
        <TextField
          label={t("editor.break_start")}
          type="time"
          value={breakState.startTime}
          onChange={(e) => handleChange("startTime", e.target.value)}
          sx={{ mt: 2, mr: 2 }}
        />

        <TextField
          label={t("editor.break_end")}
          type="time"
          value={breakState.endTime}
          onChange={(e) => handleChange("endTime", e.target.value)}
          sx={{ mt: 2 }}
        />
      </div>
      <Typography variant="caption" sx={{ mt: 2, mb: 1 }}>
        {t("editor.break_day")}
      </Typography>
      <Grid container spacing={1}>
        {days.map((day, index) => (
          <Grid item xs={6} sm={2.4} key={index}>
            <DayButton
              day={t("days.".concat(day))}
              isSelected={!!breakState.days?.includes(day)}
              onClick={() => onDayClick(day)}
            />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export const TemporaryDetails = ({
  breakState,
  handleChange,
}: DetailsProps) => {
  const { t } = useTranslation();

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <>
        <Typography variant="h6">{t("editor.break_date_title")}</Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <DatePicker
              label={t("editor.break_holiday_from")}
              value={new Date(Number(breakState.from))}
              onChange={(date) => handleChange("from", date?.getTime())}
              sx={{ mt: 2 }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <DatePicker
              label={t("editor.break_holiday_to")}
              value={new Date(Number(breakState.to))}
              onChange={(date) => handleChange("to", date?.getTime())}
              sx={{ mt: 2 }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label={t("editor.break_start")}
              type="time"
              value={breakState.startTime}
              onChange={(e) => handleChange("startTime", e.target.value)}
              sx={{ mt: 2 }}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label={t("editor.break_end")}
              type="time"
              value={breakState.endTime}
              onChange={(e) => handleChange("endTime", e.target.value)}
              sx={{ mt: 2 }}
            />
          </Grid>
        </Grid>
      </>
    </LocalizationProvider>
  );
};
