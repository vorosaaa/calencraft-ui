import { Close } from "@mui/icons-material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
} from "@mui/material";

type Props = {
  open: boolean;
  handleClose: () => void;
  header: string;
  bodySections: string[];
  footer: string;
};

const placeHolderValues = {
  $user: "Jason Statham",
  $bookingName: "Running",
  $start: "2022-12-12 10:00",
  $end: "2022-12-12 11:00",
};

export const PreviewModal = ({
  open,
  handleClose,
  header,
  bodySections,
  footer,
}: Props) => {
  const previewHeader = replacePlaceholders(header);
  const previewBodySections = bodySections.map(replacePlaceholders);
  const previewFooter = replacePlaceholders(footer);

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle
        sx={{
          alignItems: "center",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Typography>Preview</Typography>
        <IconButton color="inherit" onClick={handleClose} aria-label="close">
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <h2>{previewHeader}</h2>
        {previewBodySections.map((section, index) => (
          <p key={index}>{section}</p>
        ))}
        <p>{previewFooter}</p>
      </DialogContent>
    </Dialog>
  );
};

const replacePlaceholders = (text: string) => {
  let result = text;
  for (const placeholder in placeHolderValues) {
    result = result.replace(
      new RegExp("\\" + placeholder, "g"),
      placeHolderValues[placeholder as keyof typeof placeHolderValues],
    );
  }
  return result;
};
