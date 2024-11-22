import { useState, ChangeEvent } from "react";
import {
  Paper,
  TextField,
  Button,
  IconButton,
  Typography,
  Box,
  Container,
  useTheme,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useTranslation } from "react-i18next";
import { Delete } from "@mui/icons-material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { createManualBooking } from "../../../api/bookingApi";
import {
  enqueueError,
  enqueueSuccess,
  enqueueWarning,
} from "../../../enqueueHelper";
import { colors } from "../../../theme/colors";
import { useMutation } from "@tanstack/react-query";

interface User {
  name: string;
  email: string;
}

interface Errors {
  [key: string]: boolean;
}

interface BookingState {
  name: string;
  price: number;
  date: string;
  startTime: string;
  endTime: string;
  users: User[];
}

const initialBooking: BookingState = {
  name: "",
  price: 0,
  date: "",
  startTime: "",
  endTime: "",
  users: [{ name: "", email: "" }],
};

export const NewBookingPage = () => {
  const theme = useTheme();
  const inputBaseHeight = theme.spacing(7);
  const { t } = useTranslation();
  const [errors, setErrors] = useState<Errors>({});
  const [bookingState, setBookingState] =
    useState<BookingState>(initialBooking);

  const { mutate, isPending } = useMutation({
    mutationFn: createManualBooking,
    onSuccess: (data: any) => {
      setBookingState(initialBooking);
      if (data.success) {
        enqueueSuccess(t(`messages.success.${data.message}`));
      } else {
        enqueueError(t(`messages.errors.${data.message}`));
      }
    },
    onError: (error: any) => {
      if (error.response.data.message === "EMAIL_FAILED") {
        enqueueWarning(t("messages.warnings.BOOKING_SUCCESSFUL_EMAIL_FAILED"));
        return;
      }
      enqueueError(t(`messages.errors.${error.response.data.message}`));
    },
  });

  const handleAddUser = () => {
    setBookingState((prevState) => ({
      ...prevState,
      users: [...prevState.users, { name: "", email: "" }],
    }));
  };

  const handleDeleteUser = (index: number) => {
    setBookingState((prevState) => ({
      ...prevState,
      users: prevState.users.filter((_, i) => i !== index),
    }));
  };

  const handleChange = (field: keyof BookingState, value: string) => {
    setBookingState((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleUserChange = (
    index: number,
    field: keyof User,
    value: string,
  ) => {
    setBookingState((prevState) => {
      const newUsers = [...prevState.users];
      newUsers[index] = {
        ...newUsers[index],
        [field]: value,
      };
      return {
        ...prevState,
        users: newUsers,
      };
    });
  };

  const handleCreateBooking = () => {
    const { name, price, date, startTime, endTime, users } = bookingState;
    const newErrors: Errors = {};
    if (!name) newErrors.name = true;
    if (!price) newErrors.price = true;
    if (!date) newErrors.date = true;
    if (!startTime) newErrors.startTime = true;
    if (!endTime) newErrors.endTime = true;
    users.forEach((user, index) => {
      if (!user.name) newErrors[`userName${index}`] = true;
      if (!user.email) newErrors[`userEmail${index}`] = true;
    });
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const booking = {
        name,
        price,
        date: new Date(date).getTime(),
        startTime,
        endTime,
        users,
      };
      mutate(booking);
    }
  };

  return (
    <Container disableGutters maxWidth="sm" sx={{ mt: 2 }}>
      <Paper elevation={8} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          {t("booking.title")}
        </Typography>
        <TextField
          label={t("booking.name")}
          value={bookingState.name}
          onChange={(e) => handleChange("name", e.target.value)}
          error={!!errors.name}
          helperText={errors.name ? t("booking.required") : ""}
          fullWidth
          margin="normal"
        />
        <TextField
          label={t("booking.price")}
          value={bookingState.price}
          type="number"
          onChange={(e) => handleChange("price", e.target.value)}
          error={!!errors.price}
          helperText={errors.price ? t("booking.required") : ""}
          fullWidth
          margin="normal"
        />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            disablePast
            sx={{ marginTop: 2, width: "100%" }}
            label={t("profile.secondStep.date")}
            value={bookingState.date}
            slotProps={{
              textField: {
                error: !!errors.date,
                helperText: errors.date ? t("booking.required") : "",
              },
            }}
            onChange={(e) => handleChange("date", e || "")}
          />
        </LocalizationProvider>
        <Box sx={{ display: "flex", gap: 2, my: 2 }}>
          <TextField
            label={t("booking.startTime")}
            type="time"
            value={bookingState.startTime}
            onChange={(e) => handleChange("startTime", e.target.value)}
            error={!!errors.startTime}
            helperText={errors.startTime ? t("booking.required") : ""}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label={t("booking.endTime")}
            type="time"
            value={bookingState.endTime}
            onChange={(e) => handleChange("endTime", e.target.value)}
            error={!!errors.endTime}
            helperText={errors.endTime ? t("booking.required") : ""}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
        </Box>
        <Typography variant="h6" sx={{ my: 2 }}>
          {t("booking.users")}
        </Typography>
        {bookingState.users.map((user, index) => (
          <Box key={index} sx={{ display: "flex", mb: 2 }}>
            <TextField
              sx={{ flex: 4, pr: 1 }}
              label={t("booking.userName")}
              value={user.name}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleUserChange(index, "name", e.target.value)
              }
              error={!!errors[`userName${index}`]}
              helperText={
                errors[`userName${index}`] ? t("booking.required") : ""
              }
            />
            <TextField
              sx={{ flex: 6, pr: 1 }}
              label={t("booking.email")}
              value={user.email}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleUserChange(index, "email", e.target.value)
              }
              error={!!errors[`userEmail${index}`]}
              helperText={
                errors[`userEmail${index}`] ? t("booking.required") : ""
              }
            />
            <Box sx={{ flex: 1 }}>
              <Button
                variant="outlined"
                color="error"
                sx={{ height: inputBaseHeight }}
                onClick={() => handleDeleteUser(index)}
                fullWidth
              >
                <Delete fontSize="small" />
              </Button>
            </Box>
          </Box>
        ))}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <IconButton onClick={handleAddUser}>
            <AddIcon />
          </IconButton>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateBooking}
          >
            {isPending ? (
              <CircularProgress size={24} sx={{ color: colors.white }} />
            ) : (
              t("booking.create")
            )}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};
