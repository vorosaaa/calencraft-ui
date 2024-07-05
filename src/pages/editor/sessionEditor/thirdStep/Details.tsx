import {
  Container,
  TextField,
  Button,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Grid,
  SelectChangeEvent,
  Switch,
  FormGroup,
  FormLabel,
} from "@mui/material";
import { SessionType } from "../../../../types/SessionType";
import { NavigatorContainer } from "../../css/ProfileEditor.css";
import { useTranslation } from "react-i18next";
import { DayButton } from "../../../../components/DayButton";
import { RepeatType } from "../../../../types/enums";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { useState } from "react";

export type SelectedTimeFrames = { [key: string]: string[] };
type Props = {
  selectedType: SessionType;
  handleSubmit: () => void;
  handleChange: (
    key: keyof SessionType,
    value: string | number | string[] | RepeatType,
    isFixed?: boolean,
  ) => void;
  handleBack: () => void;
};
export type SessionSpecification = {
  lengthInMinutes: number;
  startTime: string;
  endTime: string;
  days: string[];
  repeat: RepeatType;
};

const days = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export const Details = ({
  selectedType,
  handleChange,
  handleBack,
  handleSubmit,
}: Props) => {
  const { t } = useTranslation();
  const [isFixed, setIsFixed] = useState(false);

  //Handlers, functions
  const onDayClick = (day: string) => {
    if (selectedType.days.includes(day)) {
      handleChange(
        "days",
        selectedType.days.filter((actualDay) => actualDay !== day),
      );
    } else {
      handleChange("days", [...selectedType.days, day]);
    }
  };

  const onSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextIsFixed = event.target.checked;
    setIsFixed(nextIsFixed);

    if (nextIsFixed) {
      const [startHours, startMinutes] = selectedType.startTime
        .split(":")
        .map(Number);
      const [endHours, endMinutes] = selectedType.endTime
        .split(":")
        .map(Number);
      const startTime = new Date();
      startTime.setHours(startHours, startMinutes, 0);
      const endTime = new Date();
      endTime.setHours(endHours, endMinutes, 0);

      const differenceInMinutes =
        (endTime.getTime() - startTime.getTime()) / (1000 * 60);
      handleChange("lengthInMinutes", differenceInMinutes);
    }
  };
  return (
    <Container
      sx={{
        marginBottom: 4,
        marginTop: 4,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {selectedType.maxCapacity && selectedType.maxCapacity > 1 && (
        <FormGroup sx={{ mb: 2 }}>
          <FormLabel component="legend">{t("editor.fixed_time")}</FormLabel>
          <Switch
            value={isFixed}
            title={t("editor.fixed_time")}
            onChange={onSwitchChange}
          />
        </FormGroup>
      )}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        {!isFixed && (
          <Grid item xs={6} sm={3}>
            <TextField
              label={t("editor.session_length")}
              type="number"
              value={selectedType.lengthInMinutes}
              onChange={(e) =>
                handleChange("lengthInMinutes", Number(e.target.value), isFixed)
              }
              fullWidth
            />
          </Grid>
        )}
        <Grid item xs={6} sm={2}>
          <TextField
            label={t(isFixed ? "editor.from" : "editor.session_from")}
            type="time"
            value={selectedType.startTime}
            onChange={(e) => handleChange("startTime", e.target.value, isFixed)}
            fullWidth
          />
        </Grid>
        <Grid item xs={6} sm={2}>
          <TextField
            label={t(isFixed ? "editor.to" : "editor.session_to")}
            type="time"
            value={selectedType.endTime}
            onChange={(e) => handleChange("endTime", e.target.value, isFixed)}
            fullWidth
          />
        </Grid>
        <Grid item xs={6} sm={2.5}>
          <RepeatTypeSelect
            value={selectedType.repeat}
            onChange={(e) => handleChange("repeat", e)}
          />
        </Grid>
      </Grid>
      <Typography sx={{ mb: 1, mt: 1 }} variant="caption">
        {t("editor.session_days")}
      </Typography>
      <Grid container spacing={1}>
        {days.map((day, index) => (
          <Grid item xs={6} sm={2.4} key={index}>
            <DayButton
              day={t("days.".concat(day))}
              isSelected={selectedType.days.includes(day)}
              onClick={() => onDayClick(day)}
            />
          </Grid>
        ))}
      </Grid>

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

type DatePickerComponentProps = {
  selectedDate: Date | null;
  handleDateChange: (date: Date | null) => void;
};

const DatePickerComponent = ({
  selectedDate,
  handleDateChange,
}: DatePickerComponentProps) => (
  <LocalizationProvider dateAdapter={AdapterDateFns}>
    <DatePicker
      label="Select date"
      value={selectedDate}
      onChange={handleDateChange}
    />
  </LocalizationProvider>
);

type RepeatTypeSelectProps = {
  value: RepeatType;
  onChange: (value: RepeatType) => void;
};

const RepeatTypeSelect = ({ value, onChange }: RepeatTypeSelectProps) => {
  const { t } = useTranslation();

  const handleChange = (event: SelectChangeEvent<RepeatType>) => {
    onChange(event.target.value as RepeatType);
  };

  return (
    <FormControl fullWidth>
      <Select value={value} onChange={handleChange}>
        <MenuItem value={RepeatType.ONCE}>{t("editor.session_once")}</MenuItem>
        <MenuItem value={RepeatType.WEEKLY}>
          {t("editor.session_weekly")}
        </MenuItem>
        <MenuItem value={RepeatType.BI_WEEKLY}>
          {t("editor.session_bi_weekly")}
        </MenuItem>
        <MenuItem value={RepeatType.MONTHLY}>
          {t("editor.session_monthly")}
        </MenuItem>
      </Select>
    </FormControl>
  );
};
