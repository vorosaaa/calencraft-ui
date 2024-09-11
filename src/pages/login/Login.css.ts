import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { IconButton } from "@mui/material";

export const View = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(0),
}));

export const FormParent = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  maxWidth: "400px",
  margin: "0px",
  padding: "0px",
  [theme.breakpoints.down("sm")]: {
    padding: "0",
  },
}));

export const SubmitButton = styled(Button)(({ theme }) => ({
  marginTop: "20px",
}));

export const StyledContainer = styled('div')({

  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  height: "100vh",
});

export const CarouselBox = styled(Box)(({ theme }) => ({
  
  margin: "0px",
  alignItems: "center",
  width: "66.67%",
  overflow: "hidden",
  backgroundColor: "lightgray",
  [theme.breakpoints.down("sm")]: {
    display: 'none',
  },
}));


export const FormBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  margin: "0px",
  alignItems: "center",
  width: "33.33%",
  padding: theme.spacing(2),
  [theme.breakpoints.down("sm")]: {
    width: "100vw",
    height: "100vh",
  },
}));

export const BackButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  top: theme.spacing(1),
  left: theme.spacing(1),
}));