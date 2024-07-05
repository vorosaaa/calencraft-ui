import { Button, Container, FormControl, styled } from "@mui/material";

export const View = styled(Container)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginTop: theme.spacing(4),
}));

export const Form = styled(FormControl)(({ theme }) => ({
  margin: theme.spacing(1),
  minWidth: 120,
}));

export const SubmitButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(2, 0),
}));
