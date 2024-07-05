import { Typography, styled } from "@mui/material";

export const Title = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  marginTop: theme.spacing(2),
}));

export const NavigatorContainer = styled("div")(() => ({
  display: "flex",
  justifyContent: "space-between",
}));
