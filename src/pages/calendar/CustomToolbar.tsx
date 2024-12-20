import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Toolbar,
  Typography,
} from "@mui/material";
import { ToolbarProps, Views } from "react-big-calendar";
import { BookingToggleButton } from "./BookingToggleButton";
import { useTranslation } from "react-i18next";
import { useCheckMobileScreen } from "../../hooks/screenHook";
import { CalendarEvent } from "./CustomEvent";

type CustomToolbarProps = {
  isProvider: boolean;
  calendarType: "provider" | "user";
  setCalendarType: (str: "provider" | "user") => void;
} & ToolbarProps<CalendarEvent, object>;

export const CustomToolbar = (props: CustomToolbarProps) => {
  const {
    isProvider,
    calendarType,
    view,
    label,
    setCalendarType,
    onNavigate,
    onView,
  } = props;
  const { t } = useTranslation();
  const isMobile = useCheckMobileScreen();
  return isMobile ? (
    <MobileToolbar {...props} />
  ) : (
    <Toolbar
      disableGutters
      sx={{
        marginBottom: "16px",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex", width: "30%" }}>
        {isProvider && (
          <FormControl fullWidth size="small">
            <InputLabel id="user-type-label">{t("calendar.view")}</InputLabel>
            <Select
              labelId="user-type-label"
              id="usertypeselector"
              value={calendarType}
              label={t("calendar.view")}
              onChange={(e) =>
                setCalendarType(e.target.value as "provider" | "user")
              }
            >
              <MenuItem value="user">{t("calendar.client_view")}</MenuItem>
              <MenuItem value="provider">
                {t("calendar.provider_view")}
              </MenuItem>
            </Select>
          </FormControl>
        )}
        <Button onClick={() => onNavigate("TODAY")}>
          {t("calendar.today")}
        </Button>
        <Button variant="outlined" onClick={() => onNavigate("PREV")}>
          {"<"}
        </Button>

        <Button variant="outlined" onClick={() => onNavigate("NEXT")}>
          {">"}
        </Button>
      </div>
      <Typography variant="h6">{label}</Typography>

      <div style={{ display: "flex", alignItems: "flex-end" }}>
        <Button
          variant={view === Views.MONTH ? "contained" : "outlined"}
          onClick={() => onView(Views.MONTH)}
        >
          {t("calendar.month")}
        </Button>
        <Button
          variant={view === Views.WEEK ? "contained" : "outlined"}
          onClick={() => onView(Views.WEEK)}
        >
          {t("calendar.week")}
        </Button>
        <Button
          variant={view === Views.DAY ? "contained" : "outlined"}
          onClick={() => onView(Views.DAY)}
        >
          {t("calendar.day")}
        </Button>
        <BookingToggleButton />
      </div>
    </Toolbar>
  );
};

const MobileToolbar = ({
  isProvider,
  calendarType,
  view,
  label,
  setCalendarType,
  onNavigate,
  onView,
}: CustomToolbarProps) => {
  const { t } = useTranslation();
  return (
    <Toolbar
      disableGutters
      sx={{
        marginBottom: "16px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {isProvider && (
        <FormControl fullWidth size="small">
          <InputLabel id="user-type-label">{t("calendar.view")}</InputLabel>
          <Select
            labelId="user-type-label"
            id="usertypeselector"
            value={calendarType}
            label={t("calendar.view")}
            onChange={(e) =>
              setCalendarType(e.target.value as "provider" | "user")
            }
          >
            <MenuItem value="user">{t("calendar.client_view")}</MenuItem>
            <MenuItem value="provider">{t("calendar.provider_view")}</MenuItem>
          </Select>
        </FormControl>
      )}
      <Typography variant="h6">{label}</Typography>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Button
          variant={view === Views.MONTH ? "contained" : "outlined"}
          onClick={() => onView(Views.MONTH)}
        >
          {t("calendar.month")}
        </Button>
        <Button
          variant={view === Views.DAY ? "contained" : "outlined"}
          onClick={() => onView(Views.DAY)}
        >
          {t("calendar.day")}
        </Button>
        <Button variant="outlined" onClick={() => onNavigate("PREV")}>
          {"<"}
        </Button>
        <Button onClick={() => onNavigate("TODAY")}>
          {t("calendar.today")}
        </Button>
        <Button variant="outlined" onClick={() => onNavigate("NEXT")}>
          {">"}
        </Button>
      </div>
    </Toolbar>
  );
};
