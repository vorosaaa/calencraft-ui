import { Button } from "@mui/material";

type DayButtonProps = {
  day: string;
  isSelected: boolean;
  onClick: () => void;
};

export const DayButton = ({ day, isSelected, onClick }: DayButtonProps) => (
  <Button
    variant={isSelected ? "contained" : "outlined"}
    color="secondary"
    onClick={onClick}
    fullWidth
  >
    {day}
  </Button>
);
