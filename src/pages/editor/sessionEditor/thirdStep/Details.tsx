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
  Box,
  Collapse,
  IconButton,
} from "@mui/material";
import { SessionType } from "../../../../types/sessionType";
import { NavigatorContainer } from "../../css/ProfileEditor.css";
import { useTranslation } from "react-i18next";
import { DayButton } from "../../../../components/DayButton";
import { RepeatType } from "../../../../types/enums";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Info } from "@mui/icons-material";
import { useCheckMobileScreen } from "../../../../hooks/screenHook";

export type SelectedTimeFrames = { [key: string]: string[] };
type Props = {
  selectedType: SessionType;
  handleSubmit: () => void;
  handleChange: (
    key: keyof SessionType,
    value: string | number | string[] | RepeatType | null,
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
      {!isFixed && (
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <InfoBoxGridItem
            text={t("editor.length_frequency_description", {
              length: selectedType.lengthInMinutes,
              frequency: selectedType.generationFrequency,
            })}
            mobile
          />
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
          <Grid item xs={6} sm={3}>
            <TextField
              label={t("editor.generation_frequency")}
              type="number"
              value={selectedType.generationFrequency}
              onChange={(e) =>
                handleChange(
                  "generationFrequency",
                  Number(e.target.value),
                  isFixed,
                )
              }
              fullWidth
            />
          </Grid>
          <InfoBoxGridItem
            text={t("editor.length_frequency_description", {
              length: selectedType.lengthInMinutes,
              frequency: selectedType.generationFrequency,
            })}
            mobile={false}
          />
        </Grid>
      )}

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <InfoBoxGridItem text={t("editor.from_to_description")} mobile />
        <Grid item xs={6} sm={3}>
          <TextField
            label={t(isFixed ? "editor.from" : "editor.session_from")}
            type="time"
            value={selectedType.startTime}
            onChange={(e) => handleChange("startTime", e.target.value, isFixed)}
            fullWidth
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <TextField
            label={t(isFixed ? "editor.to" : "editor.session_to")}
            type="time"
            value={selectedType.endTime}
            onChange={(e) => handleChange("endTime", e.target.value, isFixed)}
            fullWidth
          />
        </Grid>
        <InfoBoxGridItem
          text={t("editor.from_to_description")}
          mobile={false}
        />
      </Grid>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <InfoBoxGridItem text={t("editor.date_repeat_description")} mobile />
        <Grid item xs={6} sm={3}>
          <DatePickerComponent
            selectedDate={selectedType.validFrom}
            handleDateChange={(date) => handleChange("validFrom", date)}
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <RepeatTypeSelect
            value={selectedType.repeat}
            onChange={(e) => handleChange("repeat", e)}
          />
        </Grid>
        <InfoBoxGridItem
          text={t("editor.date_repeat_description")}
          mobile={false}
        />
      </Grid>
      {selectedType.repeat !== RepeatType.ONCE && (
        <Typography sx={{ mb: 1, mt: 1 }} variant="caption">
          {t("editor.session_days")}
        </Typography>
      )}
      {selectedType.repeat !== RepeatType.ONCE && (
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

type DatePickerComponentProps = {
  selectedDate: number | null;
  handleDateChange: (date: number | null) => void;
};

const DatePickerComponent = ({
  selectedDate,
  handleDateChange,
}: DatePickerComponentProps) => {
  const { t } = useTranslation();
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        sx={{ width: "100%" }}
        label={t("editor.valid_from")}
        value={Number(selectedDate)}
        onChange={handleDateChange}
      />
    </LocalizationProvider>
  );
};

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
      </Select>
    </FormControl>
  );
};

type InfoBoxGridItemProps = {
  text: string;
  mobile: boolean;
};

const InfoBoxGridItem = ({ text, mobile }: InfoBoxGridItemProps) => {
  return (
    <Grid
      item
      xs={mobile ? 12 : 0}
      sm={mobile ? 0 : 6}
      sx={{
        display: {
          xs: mobile ? "block" : "none",
          sm: mobile ? "none" : "block",
        },
      }}
    >
      <InfoBox text={text} />
    </Grid>
  );
};

type InfoBoxProps = {
  text: string;
};

const InfoBox = ({ text }: InfoBoxProps) => {
  const isMobile = useCheckMobileScreen();
  const [expanded, setExpanded] = useState(isMobile);

  return (
    <Box
      sx={{
        alignItems: "center",
        width: expanded ? "100%" : "auto",
        display: isMobile ? "flex" : "inline-flex",
        justifyContent: "space-between",
        height: "100%",
        border: 1,
        borderRadius: 1,
        borderColor: "grey.400",
        p: 1,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Info color="info" sx={{ mr: 1 }} />
        <Collapse in={expanded} orientation="horizontal" unmountOnExit>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row", // Arrange icons and text horizontally
              alignItems: "center",
              whiteSpace: isMobile ? "normal" : "nowrap", // Prevent text from wrapping
            }}
          >
            <Typography variant="caption">{text}</Typography>
          </Box>
        </Collapse>
      </Box>

      {!isMobile && (
        <IconButton onClick={() => setExpanded(!expanded)}>
          {expanded ? <ChevronLeft /> : <ChevronRight />}
        </IconButton>
      )}
    </Box>
  );
};
