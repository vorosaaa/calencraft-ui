import { Button, Grid, styled, Typography } from "@mui/material";

// Section container with theme-based spacing
export const Section = styled(Grid)(({ theme }) => ({
  minHeight: "80vh", // Full viewport height
  padding: theme.spacing(6, 0),
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  backgroundColor: theme.palette.background.default,
}));

// Section title styled with theme-based margin
export const SectionTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  textAlign: "left",
  fontWeight: "normal",
}));

// Section content styling with theme spacing for typography
export const SectionContent = styled(Typography)(() => ({
  fontSize: "1.1rem",
  lineHeight: 1.6,
}));

// Section layout container allowing custom alignment of image and content
export const SectionLayout = styled(Grid)<{
  isMobile?: boolean;
  reverse?: boolean;
}>(({ theme, isMobile, reverse }) => ({
  display: "flex",
  flexDirection: reverse ? "row-reverse" : "row",
  paddingLeft: isMobile ? theme.spacing(2) : theme.spacing(16),
  paddingRight: isMobile ? theme.spacing(2) : theme.spacing(16),
  justifyContent: "space-between",
  alignItems: "center",
  gap: theme.spacing(8),
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
  },
}));

// Image wrapper for consistent image sizing
export const ImageWrapper = styled("div")({
  flex: 1,
  img: {
    width: "100%",
    height: "auto",
    borderRadius: "10px",
  },
});

// Content wrapper for consistent spacing
export const ContentWrapper = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  flex: 1,
  padding: theme.spacing(2),
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
