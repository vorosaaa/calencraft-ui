import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useTranslation } from "react-i18next";

type DialogProps = {
  openDialog: boolean;
  reason: string;
  isLoading: boolean;
  handleCloseDialog: () => void;
  handleConfirmRemove: () => void;
  setReason: React.Dispatch<React.SetStateAction<string>>;
};
export const DeleteDialog = ({
  openDialog,
  reason,
  isLoading,
  handleCloseDialog,
  handleConfirmRemove,
  setReason,
}: DialogProps) => {
  const { t } = useTranslation();

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={openDialog}
      onClose={handleCloseDialog}
    >
      <DialogTitle sx={{ mb: 1 }}>
        {t("bookingDetails.modals.delete.title")}
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 1 }}>
          {t("bookingDetails.modals.delete.content")}
        </DialogContentText>
        <TextField
          required={false}
          autoFocus
          margin="dense"
          label={t("bookingDetails.modals.delete.reason")}
          fullWidth
          variant="outlined"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
      </DialogContent>
      <DialogActions
        sx={{
          justifyContent: "space-between",
          paddingRight: 3,
          paddingLeft: 3,
        }}
      >
        <Button onClick={handleCloseDialog} color="inherit">
          {t("bookingDetails.modals.delete.cancel")}
        </Button>
        <Button onClick={handleConfirmRemove} color="error" variant="contained">
          {isLoading ? (
            <CircularProgress color="inherit" size={24} />
          ) : (
            t("bookingDetails.modals.delete.deleteSession")
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
