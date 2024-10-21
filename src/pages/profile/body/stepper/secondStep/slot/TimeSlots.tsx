import { Badge, Button, Grid } from "@mui/material";
import { TimeSlot } from "../../../../../../types/timeSlot";
import { formatTime } from "../../stepperUtils";

type Props = {
  selectedStartTime?: Date;
  maxCapacity?: number;
  slots: TimeSlot[];
  onClick: (startTime: Date, free: boolean) => void;
};

export const TimeSlots = ({
  selectedStartTime,
  slots,
  maxCapacity = 0,
  onClick,
}: Props) => {
  return (
    <Grid
      container
      spacing={1}
      sx={{
        mt: 1,
        marginBottom: 4,
        textAlign: "center",
      }}
    >
      {slots.map((slot: any, index) => (
        <Grid item key={index} xs={3} sm={2}>
          <Badge
            badgeContent={
              maxCapacity > 1 && slot.users > 0
                ? `${slot.users}/${maxCapacity}`
                : null
            }
            color="primary"
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            sx={{ display: "block" }}
          >
            <Button
              sx={{ width: "100%" }}
              fullWidth
              variant={
                selectedStartTime === slot.startTime ? "contained" : "outlined"
              }
              color={slot.free ? "primary" : "secondary"}
              onClick={() => onClick(slot.startTime, slot.free)}
            >
              {formatTime(slot.startTime)}
            </Button>
          </Badge>
        </Grid>
      ))}
    </Grid>
  );
};
