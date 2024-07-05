import { Container, styled } from "@mui/material";

export const View = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
  padding: theme.spacing(4),
}));

export const SearchContainer = styled("div")(({ theme }) => ({
  marginBottom: theme.spacing(3),
  display: "flex",
  alignItems: "center",
}));
