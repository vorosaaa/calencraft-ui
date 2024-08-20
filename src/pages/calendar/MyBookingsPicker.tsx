import {
  DataGrid,
  GridColDef,
  GridTreeNodeWithRender,
  GridValueGetterParams,
} from "@mui/x-data-grid";
import {
  Container,
  Skeleton,
  LinearProgress,
  Grid,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { BookingResponse } from "../../types/booking";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { useEffect, useState } from "react";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { useCheckMobileScreen } from "../../hooks/screenHook";
import { BookingToggleButton } from "./BookingToggleButton";
import { useTranslation } from "react-i18next";

type Props = {
  calendarType: "provider" | "user";
  dateRange: { start: Date | null; end: Date | null };
  bookings: BookingResponse[] | undefined;
  isLoading: boolean;
  isProvider: boolean;
  setDateRange: (body: { start: Date | null; end: Date | null }) => void;
  setCalendarType: (str: "provider" | "user") => void;
  onBookingClick: (id: string) => void;
};

const columns: GridColDef[] = [
  {
    field: "sessionName",
    headerName: "calendar.name",
    flex: 1,
    valueGetter: (params) => params.row.name,
  },
  {
    field: "providerName",
    headerName: "calendar.provider",
    flex: 1,
    valueGetter: (params) => params.row.provider.name,
  },
  {
    field: "date",
    headerName: "calendar.date",
    flex: 1,
    valueGetter: (params) =>
      new Date(Number(params.row.date)).toLocaleDateString(),
  },
  { field: "startTime", headerName: "calendar.start_time", flex: 1 },
  { field: "endTime", headerName: "calendar.end_time", flex: 1 },
  // Add more columns as needed
];

const getClientName = (
  params: GridValueGetterParams<any, any, GridTreeNodeWithRender>,
) => {
  if (params.row.sessionType?.type === "PRIVATE")
    return params.row.users[0].name;
  if (params.row.sessionType?.type === "GROUP") return params.row.users.length;
  return "";
};

export const MyBookingsPicker = ({
  calendarType,
  isProvider,
  bookings,
  isLoading,
  dateRange,
  setCalendarType,
  setDateRange,
  onBookingClick,
}: Props) => {
  const isMobile = useCheckMobileScreen();
  const { t } = useTranslation();

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleDateChange = async () => {
    if (startDate && endDate) {
      setDateRange({ start: startDate, end: endDate });
    }
  };

  const translatedColumns = columns.map((column) => ({
    ...column,
    field:
      column.field === "providerName" && isProvider
        ? "clientName"
        : column.field,
    valueGetter:
      column.field === "providerName" && isProvider
        ? getClientName
        : column.valueGetter,
    headerName:
      column.field === "providerName" && isProvider
        ? t("calendar.client")
        : t(`${column.headerName}`),
  }));

  useEffect(() => {
    setStartDate(dateRange.start);
    setEndDate(dateRange.end);
  }, []);
  return (
    <Container disableGutters>
      <Grid
        sx={{
          justifyContent: "space-between",
          marginBottom: 2,
          marginTop: 0,
        }}
        container
        spacing={2}
      >
        <Grid
          item
          style={{
            display: "flex",
            flexDirection: "row",
            alignContent: "center",
          }}
        >
          {isProvider && (
            <FormControl sx={{ mr: 2 }}>
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
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              sx={{ mr: 2 }}
              label={t("calendar.start_date")}
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
            />
            <DatePicker
              label={t("calendar.end_date")}
              value={endDate}
              onChange={(newValue) => setEndDate(newValue)}
            />
          </LocalizationProvider>
        </Grid>
        {!isMobile && (
          <Grid item>
            <BookingToggleButton />
          </Grid>
        )}
      </Grid>
      <Button variant="contained" onClick={handleDateChange}>
        {t("calendar.search")}
      </Button>
      <div style={{ marginTop: 20 }}>
        {bookings ? (
          <DataGrid
            autoHeight
            loading={isLoading}
            slots={{ loadingOverlay: LinearProgress }}
            columns={translatedColumns}
            rows={bookings}
            onRowClick={(params) => onBookingClick(params.row.id)}
            rowSelection={false}
            initialState={{
              pagination: { paginationModel: { pageSize: 5 } },
            }}
            pageSizeOptions={[5, 10, 20]}
          />
        ) : (
          <LoadingView />
        )}
      </div>
    </Container>
  );
};

const LoadingView = () => {
  return (
    <>
      <Skeleton
        animation="wave"
        height={60}
        variant="rounded"
        sx={{ marginBottom: 2 }}
      />
      <Skeleton animation="wave" height={400} variant="rounded" />
    </>
  );
};
