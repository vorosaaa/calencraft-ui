import { useEffect, useMemo, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import {
  format,
  parseISO,
  startOfWeek,
  getDay,
  addDays,
  isSameDay,
  startOfDay,
  endOfDay,
} from "date-fns";
import { enUS, hu } from "date-fns/locale";
import { BookingResponse } from "../../types/booking";
import { CustomToolbar } from "./CustomToolbar";
import { CalendarEvent, CustomEvent } from "./CustomEvent";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { BreakStateType } from "../../types/breakStateType";
import { Box } from "@mui/material";
import { useCheckMobileScreen } from "../../hooks/screenHook";
import { BookingType } from "../../types/enums";

// MyCalendar Component
const locales = {
  "en-US": enUS,
  "hu-HU": hu,
};

const localizer = dateFnsLocalizer({
  format,
  parse: (str: string) => parseISO(str),
  startOfWeek: (date: Date | number) => startOfWeek(date, { weekStartsOn: 1 }), // 0 is Sunday, 1 is Monday
  getDay: (date: Date | number) => getDay(date), // Adjust for 0-based indexing
  locales,
});

type Props = {
  calendarType: "provider" | "user";
  bookings?: BookingResponse[];
  breaks?: BreakStateType[];
  isProvider: boolean;
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  setDateRange: (value: { start: Date | null; end: Date | null }) => void;
  handleCancellation: (id: string) => void;
  setCalendarType: (str: "provider" | "user") => void;
  onBookingClick: (id: string) => void;
};

export const MyBookingsCalendar = ({
  isProvider,
  calendarType,
  bookings,
  breaks,
  dateRange,
  handleCancellation,
  setCalendarType,
  setDateRange,
  onBookingClick,
}: Props) => {
  const isMobile = useCheckMobileScreen();
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    const currentDate = new Date();
    const start = startOfWeek(currentDate, { weekStartsOn: 1 });
    const end = addDays(start, 8);
    setDateRange({ start, end });
  }, []);

  const handleRangeChange = (range: Date[] | { start: Date; end: Date }) => {
    if (Array.isArray(range)) {
      const start = range[0];
      const end = addDays(range[range.length - 1], 3); // Changed to add 3 days
      setDateRange({ start, end });
    } else {
      setDateRange({ start: range.start, end: addDays(range.end, 3) }); // Changed to add 3 days
    }
  };

  useMemo(() => {
    const events = generateEvents(
      bookings || [],
      calendarType,
      dateRange,
      breaks || [],
    );

    setEvents(events);
  }, [calendarType, bookings, dateRange, breaks]);

  return (
    <Box
      sx={{
        height: 800,
        marginTop: 1,
        "& .rbc-event": {
          padding: 0,
          border: 0,
          minHeight: "5px",
          //fix back-to-back 15minute event overlapping style
          width: "100%",
          left: "0%",
        },
        "& .rbc-event-label": { display: "none" },
      }}
    >
      <Calendar
        events={events}
        step={15}
        timeslots={4}
        formats={{
          eventTimeRangeFormat: (dateRange) =>
            `${dateRange.start.getHours()}:${dateRange.start.getUTCMinutes()} - ${dateRange.end.getHours()}:${dateRange.end.getUTCMinutes()}`,
        }}
        components={{
          toolbar: (props) => (
            <CustomToolbar
              isProvider={isProvider}
              calendarType={calendarType}
              setCalendarType={setCalendarType}
              {...props}
            />
          ),
          event: (props) => (
            <CustomEvent
              {...props}
              onDeleteClick={handleCancellation}
              onBookingClick={onBookingClick}
            />
          ),
        }}
        defaultView={isMobile ? "day" : "week"}
        localizer={localizer}
        onRangeChange={handleRangeChange}
      />
    </Box>
  );
};

const convertBookingsToEvents = (
  bookings: BookingResponse[],
  calendarType: "user" | "provider",
): CalendarEvent[] => {
  return bookings.map((booking) => {
    // Convert booking.date from epoch to Date object
    const bookingDate = new Date(+booking.date);
    // Extract year, month, and day to combine with startTime and endTime
    const year = bookingDate.getFullYear();
    const month = bookingDate.getMonth(); // Note: getMonth() is 0-indexed
    const day = bookingDate.getDate();

    // Assuming startTime and endTime are in 'HH:mm' format, split them to hours and minutes
    const [startHour, startMinute] = booking.startTime.split(":").map(Number);
    const [endHour, endMinute] = booking.endTime.split(":").map(Number);

    // Create start and end Date objects
    const start = new Date(year, month, day, startHour, startMinute);
    const end = new Date(year, month, day, endHour, endMinute);

    return {
      id: booking.id,
      title:
        calendarType === "user" ||
        booking.sessionType.type === BookingType.GROUP
          ? booking.sessionType.name
          : `${booking.users[0].name}: ${booking.sessionType.name}`,
      start: start,
      end: end,
      type: booking.sessionType.type,
    };
  });
};

const generateEvents = (
  bookings: BookingResponse[],
  calendarType: "provider" | "user",
  dateRange: { start: Date | null; end: Date | null },
  breaks: BreakStateType[],
): CalendarEvent[] => {
  const bookingEvents = convertBookingsToEvents(bookings || [], calendarType);
  let breakEvents: CalendarEvent[] = [];
  const { start, end } = dateRange;

  if (start && end && breaks) {
    breakEvents = convertBreaksToEvents(start, end, breaks);
  }

  return [...bookingEvents, ...breakEvents];
};

const convertBreaksToEvents = (
  startDate: Date,
  endDate: Date,
  breaks: BreakStateType[],
): CalendarEvent[] => {
  const events: CalendarEvent[] = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    breaks.forEach((breakItem) => {
      if (breakItem.type === "REGULAR") {
        if (
          breakItem.days?.includes(format(currentDate, "EEEE").toLowerCase())
        ) {
          events.push(createEvent(currentDate, breakItem));
        }
      } else if (breakItem.type === "TEMPORARY") {
        generateTemporaryEvents(currentDate, breakItem, events);
      }
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return events;
};

const createEvent = (date: Date, breakItem: BreakStateType): CalendarEvent => {
  const formattedDate = format(date, "yyyy-MM-dd");
  return {
    id: `${formattedDate}-${breakItem.name}`,
    title: breakItem.name,
    start: parseISO(`${formattedDate}T${breakItem.startTime}`),
    end: parseISO(`${formattedDate}T${breakItem.endTime}`),
    type: breakItem.type,
  };
};

const generateTemporaryEvents = (
  currentDate: Date,
  breakItem: BreakStateType,
  events: CalendarEvent[],
) => {
  const breakFrom = new Date(Number(breakItem.from!));
  const breakTo = new Date(Number(breakItem.to!));
  const startTime = breakItem.startTime;
  const endTime = breakItem.endTime;
  // Check if the currentDate falls within the temporary break range
  if (
    currentDate >= startOfDay(breakFrom) &&
    currentDate <= endOfDay(breakTo)
  ) {
    if (isSameDay(breakFrom, breakTo)) {
      // Single day temporary break
      if (isSameDay(breakFrom, currentDate)) {
        events.push(createEvent(currentDate, breakItem));
      }
    } else {
      let time: undefined | string = undefined;
      if (isSameDay(breakFrom, currentDate)) {
        time = startTime;
      } else if (isSameDay(breakTo, currentDate)) {
        time = endTime;
      }
      events.push(createAllDayEvent(currentDate, breakItem, time));
    }
  }
};

const createAllDayEvent = (
  date: Date,
  breakItem: BreakStateType,
  time?: string,
): CalendarEvent => {
  const formattedDate = format(date, "yyyy-MM-dd");
  return {
    id: `${formattedDate}-${breakItem.name}`,
    title: breakItem.name + (time ? ` (${time})` : ""),
    start: parseISO(`${formattedDate}T00:00:00`),
    end: parseISO(`${formattedDate}T23:59:59`),
    type: breakItem.type,
    allDay: true,
  };
};
