import { useEffect, useState } from "react";
import { deleteBooking, getMyBookings } from "../../api/bookingApi";
import { Container, Skeleton } from "@mui/material";
import { MyBookingsPicker } from "./MyBookingsPicker";
import { MyBookingsCalendar } from "./MyBookingsCalendar";
import { useCheckMobileScreen } from "../../hooks/screenHook";
import { useNavigate } from "react-router-dom";
import { useBookingView } from "../../hooks/viewHook";
import { useMe } from "../../queries/queries";
import { enqueueSuccess } from "../../enqueueHelper";
import { useTranslation } from "react-i18next";
import { DeleteDialog } from "../bookingdetails/DeleteDialog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const Calendar = () => {
  const navigate = useNavigate();
  const isMobile = useCheckMobileScreen();
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { bookingView } = useBookingView();

  const [calendarType, setCalendarType] = useState<"provider" | "user">("user");
  const [reason, setReason] = useState("");
  const [deleteBookingId, setDeleteBookingId] = useState<string>("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const [dateRange, setDateRange] = useState<{
    start: Date | null;
    end: Date | null;
  }>({ start: null, end: null });

  const { data: meData, isLoading: isMeLoading, isError, error } = useMe();

  const { data: bookings, isLoading } = useQuery({
    queryKey: ["mybookings", dateRange, calendarType],
    queryFn: () => getMyBookings(dateRange.start, dateRange.end, calendarType),
    refetchIntervalInBackground: true,
    refetchInterval: 1000 * 60,
  });

  const { mutate, isPending: deleteIsLoading } = useMutation({
    mutationFn: deleteBooking,
    onSuccess: () => {
      enqueueSuccess(t("bookingDetails.modals.delete.success"));
      queryClient.refetchQueries({
        queryKey: ["mybookings", dateRange, calendarType],
      });
    },
    onSettled: () => {
      setDeleteBookingId("");
      setReason("");
      setOpenDeleteDialog(false);
    },
  });

  useEffect(() => {
    if (isError && error.response.data.message === "NO_TOKEN") {
      navigate("/");
    }
  }, [isError, error]);

  const onBookingClick = (id: string) => navigate(`/booking/${id}`);
  const handleCloseDeleteDialog = () => setOpenDeleteDialog(false);
  const handleCancellation = (id: string) => {
    setDeleteBookingId(id);
    setOpenDeleteDialog(true);
  };
  const handleConfirmRemove = () => mutate({ id: deleteBookingId, reason });

  useEffect(() => {
    if (!meData) return;
    setCalendarType(meData.user.isProvider ? "provider" : "user");
  }, [meData]);

  if (!meData || isMeLoading)
    return <LoadingView loading={isMeLoading || !meData} />;

  return (
    <Container sx={{ display: "flex", flexDirection: "column", mt: 2 }}>
      {bookingView === "calendar" || isMobile ? (
        <MyBookingsCalendar
          handleCancellation={handleCancellation}
          onBookingClick={onBookingClick}
          setDateRange={setDateRange}
          setCalendarType={setCalendarType}
          dateRange={dateRange}
          breaks={meData.user.breaks}
          calendarType={calendarType}
          bookings={bookings}
          isProvider={meData.user.isProvider}
        />
      ) : (
        <MyBookingsPicker
          onBookingClick={onBookingClick}
          setDateRange={setDateRange}
          setCalendarType={setCalendarType}
          calendarType={calendarType}
          isProvider={meData.user.isProvider}
          bookings={bookings}
          isLoading={isLoading}
          dateRange={dateRange}
        />
      )}
      <DeleteDialog
        openDialog={openDeleteDialog}
        reason={reason}
        isLoading={deleteIsLoading}
        handleCloseDialog={handleCloseDeleteDialog}
        handleConfirmRemove={handleConfirmRemove}
        setReason={setReason}
      />
    </Container>
  );
};

interface LoadingViewProps {
  loading: boolean;
}

const LoadingView = ({ loading }: LoadingViewProps) => {
  if (!loading) {
    return null;
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Skeleton animation="wave" height={60} variant="rounded" sx={{ mb: 2 }} />
      <Skeleton animation="wave" height={500} variant="rounded" />
    </Container>
  );
};
