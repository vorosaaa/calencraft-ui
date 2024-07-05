import { Fragment, useState } from "react";
import {
  Button,
  Container,
  Typography,
  Card,
  CardHeader,
  CardContent,
  Grid,
  Paper,
} from "@mui/material";
import { useMutation, useQuery } from "react-query";
import { deleteBooking, getBooking } from "../../api/bookingApi";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useMe } from "../../queries/queries";
import { enqueueSuccess } from "../../enqueueHelper";
import { DeleteDialog } from "./DeleteDialog";

export const BookingDetails = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const [reason, setReason] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const { data: meData } = useMe();
  const { data: booking, isLoading } = useQuery(
    "booking",
    () => getBooking(id as string),
    { onError: () => navigate("/") },
  );
  const { mutate, isLoading: deleteIsLoading } = useMutation(
    "deleteBooking",
    deleteBooking,
    {
      onSuccess: () => {
        enqueueSuccess(t("bookingDetails.modals.delete.success"));
        navigate("/calendar");
      },
    },
  );

  if (isLoading || !booking || !meData) return <p>Loading...</p>;
  const userIsProvider = meData.user.id === booking.provider.id;

  const handleCancellation = () => setOpenDeleteDialog(true);
  const handleCloseDeleteDialog = () => setOpenDeleteDialog(false);

  const handleConfirmRemove = () => {
    mutate({ id: booking.id, reason });
    handleCloseDeleteDialog();
  };
  const bookingDateTime = getCombinedDateTime(booking.date, booking.startTime);
  const now = new Date();
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Card elevation={2}>
        <CardHeader title={booking.sessionType.name} />
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              {!userIsProvider && (
                <Typography variant="body1" gutterBottom>
                  {t("bookingDetails.provider")}: {booking.provider.name}
                </Typography>
              )}
              <Typography variant="body1" gutterBottom>
                {t("bookingDetails.description")}:{" "}
                {booking.sessionType.description}
              </Typography>
              <Typography variant="body1" gutterBottom>
                {t("bookingDetails.price")}: {booking.sessionType.price}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body1" gutterBottom>
                {t("bookingDetails.date")}:{" "}
                {new Date(booking.date).toDateString()}
              </Typography>
              <Typography variant="body1" gutterBottom>
                {t("bookingDetails.time")}: {booking.startTime} -{" "}
                {booking.endTime}
              </Typography>
              <Typography variant="body1" gutterBottom>
                {t("bookingDetails.length")}:{" "}
                {booking.sessionType.lengthInMinutes}{" "}
                {t("bookingDetails.minutes")}
              </Typography>
            </Grid>
          </Grid>
          {userIsProvider && (
            <Fragment>
              <Typography variant="h5" gutterBottom>
                {t("bookingDetails.participants")}:
              </Typography>
              <Grid container spacing={2}>
                {booking.users.map((user) => (
                  <Grid
                    item
                    xs={12}
                    sm={4}
                    key={user.id}
                    onClick={() => navigate(`/profile/${user.id}`)}
                  >
                    <Paper
                      elevation={2}
                      sx={{ padding: 2, cursor: "pointer" }}
                      onClick={() => navigate(`/profile/${user.id}`)}
                    >
                      <Typography>{user.name}</Typography>
                    </Paper>{" "}
                  </Grid>
                ))}
              </Grid>
            </Fragment>
          )}

          {bookingDateTime > now && (
            <Button
              sx={{ mt: 2 }}
              variant="contained"
              color="error"
              onClick={handleCancellation}
            >
              {userIsProvider
                ? t("bookingDetails.delete")
                : t("bookingDetails.cancel")}
            </Button>
          )}
        </CardContent>
      </Card>

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

const getCombinedDateTime = (date: number, startTime: string) => {
  const [hours, minutes] = startTime.split(":");
  const combinedDate = new Date(date);
  combinedDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0);
  return combinedDate;
};
