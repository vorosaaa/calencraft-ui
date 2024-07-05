import { Button, Container, TextField, styled } from "@mui/material";

export const View = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

export const FormParent = styled("form")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
}));

export const FormInput = styled(TextField)(() => ({
  width: "100%",
}));

export const SubmitButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(2, 0, 0, 0),
}));
