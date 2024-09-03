import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useTranslation } from "react-i18next";

type DeleteProps = {
  open: boolean;
  handleClose: () => void;
  handleDelete: () => void;
};

export const DeleteModal = ({
  open,
  handleClose,
  handleDelete,
}: DeleteProps) => {
  const { t } = useTranslation();
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {t("delete_modal.title")}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {t("delete_modal.content")}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "space-between" }}>
        <Button onClick={handleClose}>{t("delete_modal.close")}</Button>
        <Button onClick={handleDelete} color="error" autoFocus>
          {t("delete_modal.remove")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
