import { styled } from "@mui/material";
import { colors } from "../../theme/colors";

export const TypeContainer = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  backgroundColor: colors.white, // Change background color as needed
  borderStyle: "solid",
  borderWidth: 1,
  borderColor: colors.mediumGrey,
  padding: theme.spacing(2),
  borderRadius: 4,
  cursor: "pointer", // Add pointer cursor for interactivity
  transition: "background-color 0.5s ease", // Add smooth transition effect
  "&:hover": {
    backgroundColor: colors.mediumGrey,
  },
}));
