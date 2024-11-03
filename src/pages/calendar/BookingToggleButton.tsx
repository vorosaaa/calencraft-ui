import { CalendarToday, GridOn } from "@mui/icons-material";
import {
  ToggleButton,
  ToggleButtonGroup,
  ToggleButtonGroupProps,
} from "@mui/material";
import { useBookingView } from "../../hooks/viewHook";

export const BookingToggleButton = (props: ToggleButtonGroupProps) => {
  const { bookingView, setBookingView } = useBookingView();

  const handleViewChange = (
    _event: React.MouseEvent<HTMLElement>,
    newView: "calendar" | "dataGrid"
  ) => {
    setBookingView(newView);
  };
  return (
    <ToggleButtonGroup
      size="small"
      value={bookingView}
      exclusive
      onChange={handleViewChange}
      aria-label="view toggle"
      sx={{
        justifyContent: "flex-end",
        marginLeft: 2,
        alignItems: "center",
      }}
      {...props}
    >
      <ToggleButton value="calendar" aria-label="calendar view">
        <CalendarToday
          color={bookingView === "calendar" ? "primary" : "disabled"}
        />
      </ToggleButton>
      <ToggleButton value="dataGrid" aria-label="data grid view">
        <GridOn color={bookingView === "dataGrid" ? "primary" : "disabled"} />
      </ToggleButton>
    </ToggleButtonGroup>
  );
};
