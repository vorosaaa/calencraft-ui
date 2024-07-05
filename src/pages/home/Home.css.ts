import {
  Button,
  CardMedia,
  Container,
  Grid,
  Typography,
  styled,
} from "@mui/material";

export const View = styled(Container)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginTop: theme.spacing(4),
}));

export const Title = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  marginTop: theme.spacing(4),
  fontWeight: "bold",
}));

export const Text = styled(Typography)(({ theme }) => ({
  textAlign: "center",
  marginBottom: theme.spacing(2),
}));
export const IntroText = styled(Typography)(({ theme }) => ({
  textAlign: "center",
  marginBottom: theme.spacing(2),
}));

export const StartButton = styled(Button)(({ theme }) => ({
  width: 200,
  backgroundColor: theme.palette.primary.main,
  color: "#fff",
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
  },
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

export const Image = styled(CardMedia)(() => ({
  height: 360,
  objectFit: "cover",
}));
