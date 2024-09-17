import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";

export const FormParent = styled("div")(() => ({
  display: "flex",
  width: "100%",
  flexDirection: "column",
}));

export const SubmitButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(6),
  marginBottom: theme.spacing(2),
}));
