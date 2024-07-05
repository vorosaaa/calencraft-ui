import { Paper, styled } from "@mui/material";

export const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  padding: theme.spacing(1), // Add some padding for spacing
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end",
  alignItems: "center",
  position: "relative",
  cursor: "move",
  marginBottom: theme.spacing(4),
  "@media (max-width: 767px)": {
    // For mobile devices
    minHeight: "300px",
    minWidth: "300px",
  },
  "@media (min-width: 768px) and (max-width: 1199px)": {
    // For laptops and tablets
    minHeight: "400px",
    minWidth: "400px",
  },
  "@media (min-width: 1200px)": {
    // For larger monitors
    minHeight: "400px",
    minWidth: "400px",
  },
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

export const NavigatorContainer = styled("div")(() => ({
  display: "flex",
  justifyContent: "space-between",
  marginTop: 16,
}));
