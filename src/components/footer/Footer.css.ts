import { styled } from "@mui/material";
import { colors } from "../../theme/colors";

export const Root = styled("footer")(({ theme }) => ({
  marginTop: theme.spacing(4),
  backgroundColor: colors.midnightBlue,
  color: theme.palette.common.white,
  padding: theme.spacing(4, 0),
}));

export const Logo = styled("img")(() => ({
  width: 50, // Adjust as needed
  marginRight: 4,
}));
