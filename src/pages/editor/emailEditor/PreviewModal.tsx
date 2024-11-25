import { Close } from "@mui/icons-material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";

type Props = {
  open: boolean;
  handleClose: () => void;
  template: string;
};

const placeHolderValues = {
  $user: "Jason Statham",
  $bookingName: "Running",
  $start: "2022-12-12 10:00",
  $end: "2022-12-12 11:00",
};

export const PreviewModal = ({ open, handleClose, template }: Props) => {
  const { t } = useTranslation();
  const preview = replacePlaceholders(template);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          backgroundColor: (theme) => theme.palette.primary.light,
          color: (theme) => theme.palette.primary.contrastText,
          paddingBottom: 1,
          paddingTop: 1,
          alignItems: "center",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Typography>{t("editor.email_editor.preview")}</Typography>
        <IconButton color="inherit" onClick={handleClose} aria-label="close">
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Typography component="div" sx={{ whiteSpace: "pre-wrap" }}>
          {preview}
        </Typography>
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
