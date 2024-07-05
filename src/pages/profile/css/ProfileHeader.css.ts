import { Avatar, Paper, Typography, styled } from "@mui/material";
import { colors } from "../../../theme/colors";

export const Container = styled("div")(() => ({}));

export const ProfilePic = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(15),
  height: theme.spacing(15),
}));

export const Name = styled(Typography)(({ theme }) => ({
  color: colors.white,
  marginBottom: theme.spacing(1),
}));

export const TextContainer = styled("div")(({ theme }) => ({
  padding: theme.spacing(1),
  textAlign: "center",
}));

export const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center",
  minHeight: "400px",
  padding: theme.spacing(1), // Add some padding for spacing
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end",
  alignItems: "center",
  position: "relative",
}));

export const Overlay = styled("div")(() => ({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.5)", // Adjust opacity as needed
  zIndex: 1, // Place the overlay above the content
  backdropFilter: "blur(5px)", // Apply blur effect to the overlay
}));

export const ContainerOnOverlay = styled("div")(() => ({
  zIndex: 2, // Place the content above the overlay
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
}));

export const Description = styled(Typography)(({ theme }) => ({
  fontSize: "1rem",
  marginBottom: theme.spacing(2),
}));

export const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: "1.2rem",
  fontWeight: "bold",
  marginBottom: theme.spacing(1),
}));
