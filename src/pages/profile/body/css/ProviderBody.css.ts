import { styled, Container as MuiContainer } from "@mui/material";

export const BottomContainer = styled(MuiContainer)(({ theme }) => ({
  marginTop: theme.spacing(4),
  padding: theme.spacing(2),
  display: "flex",
}));

export const BottomLeftContainer = styled(MuiContainer)(() => ({
  flex: 1,
  paddingRight: 0,
  paddingLeft: 0,
}));

export const BottomRightContainer = styled(MuiContainer)(() => ({
  flex: 2,
  paddingLeft: 0,
  paddingRight: 0,
}));

export const CertificationList = styled("ul")(({ theme }) => ({
  listStyleType: "none", // Remove bullet points from certifications list
  paddingLeft: 0, // Remove default left padding
  fontSize: "1rem",
  "& li": {
    marginBottom: theme.spacing(1),
  },
}));
