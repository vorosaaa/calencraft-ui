import { styled } from "@mui/material";
import { CardElement } from "@stripe/react-stripe-js";

export const StyledCard = styled(CardElement)(({ theme }) => ({
  display: "block",
  padding: 2,
  border: "1px solid #ddd",
  borderRadius: "4px",
  backgroundColor: "white",
}));

export const CardContainer = styled("div")(({ theme }) => ({
  marginTop: "10px",
  padding: "10px",
  border: "1px solid #ccc",
  borderRadius: "4px",
}));
