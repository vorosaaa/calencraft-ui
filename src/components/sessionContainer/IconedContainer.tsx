import { TypeContainer } from "./IconedContainer.css";
import { Typography } from "@mui/material";

type Props = {
  text?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
} & React.DOMAttributes<HTMLDivElement>;

export const IconedContainer = ({ text, children, style, onClick }: Props) => {
  return (
    <TypeContainer style={style} onClick={onClick}>
      {text && <Typography>{text}</Typography>}
      {children}
    </TypeContainer>
  );
};
