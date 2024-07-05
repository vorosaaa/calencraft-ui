import { Button, Typography, styled } from "@mui/material";
import { colors } from "../../theme/colors";

export const Title = styled(Typography)(() => ({
  fontWeight: 600,
  color: colors.white,
  cursor: "pointer",
  letterSpacing: ".3rem",
}));

export const HeaderButton = styled(Button)(({ theme }) => ({
  color: colors.white,
  marginLeft: theme.spacing(2),
}));
