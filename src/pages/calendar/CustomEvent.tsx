import { Button, Container, Popover, Typography } from "@mui/material";
import { CalendarProps, Event } from "react-big-calendar";
import { colors } from "../../theme/colors";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

export type CalendarEvent = {
  type: "PRIVATE" | "GROUP" | "REGULAR" | "TEMPORARY";
  id: string;
} & Event;

type Props = {
  event: CalendarEvent;
  onBookingClick: (id: string) => void;
  onDeleteClick: (id: string) => void;
} & CalendarProps;

export const CustomEvent = ({
  event,
  onBookingClick,
  onDeleteClick,
}: Props) => {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (event.type === "REGULAR" || event.type === "TEMPORARY") return;
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const color = useMemo(() => {
    switch (event.type) {
      case "PRIVATE":
      case "GROUP":
        return colors.navyBlue;
      case "REGULAR":
      case "TEMPORARY":
        return colors.steelBlue;
      default:
        return colors.steelBlue; // Assuming there's a default color
    }
  }, [event.type]);
  return (
    <Container
      disableGutters
      sx={{
        display: "flex",
        paddingX: 0.2,
        height: "100%",
        backgroundColor: color,
        color: "#fff",
        cursor: "pointer",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {event.start &&
        event.end &&
        Math.abs(
          new Date(event.end).getTime() - new Date(event.start).getTime(),
        ) >
          15 * 60 * 1000 && (
          <Typography
            aria-describedby={id}
            onClick={handleClick}
            variant="body2"
          >
            {event.title}
          </Typography>
        )}
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <div style={{ display: "flex", flex: 1, flexDirection: "column" }}>
          <Button color="info" onClick={() => onBookingClick(event.id)}>
            <Typography
              sx={{ p: 1, paddingRight: 4, paddingLeft: 4, fontSize: 14 }}
            >
              {t("calendar.details")}
            </Typography>
          </Button>
          {event.start && new Date(event.start) > new Date() && (
            <Button
              variant="contained"
              color="error"
              onClick={() => onDeleteClick(event.id)}
            >
              <Typography
                sx={{ p: 1, paddingRight: 4, paddingLeft: 4, fontSize: 14 }}
              >
                {t("calendar.delete")}
              </Typography>
            </Button>
          )}
        </div>
      </Popover>
    </Container>
  );
};
