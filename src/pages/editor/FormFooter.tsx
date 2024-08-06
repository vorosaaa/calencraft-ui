import { MoreHoriz } from "@mui/icons-material";
import {
  Button,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";

type Props = {
  isDeleteLoading: boolean;
  handleSubmit: () => void;
  handleDeleteOpen: () => void;
};

export const FormFooter = ({
  isDeleteLoading,
  handleSubmit,
  handleDeleteOpen,
}: Props) => {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) =>
    setAnchorEl(event.currentTarget);

  const handleClose = () => setAnchorEl(null);
  const handleRemoveAccount = () => {
    handleDeleteOpen();
    handleClose();
  };
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginTop: "16px",
      }}
    >
      <Button
        variant="contained"
        sx={{ paddingX: 6 }}
        color="primary"
        onClick={handleSubmit}
      >
        {t("editor.submit")}
      </Button>
      <div>
        <IconButton
          aria-controls={open ? "account-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
        >
          {isDeleteLoading ? <CircularProgress size={24} /> : <MoreHoriz />}
        </IconButton>
        <Menu
          id="account-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          sx={{
            "& .MuiPaper-root": {
              // Targets the Paper component inside the Menu
              bgcolor: "error.main", // Sets the background color to the theme's error color
              color: "common.white", // Sets the text color to white
            },
          }}
        >
          <MenuItem onClick={handleRemoveAccount}>
            {t("editor.remove")}
          </MenuItem>
        </Menu>
      </div>
    </div>
  );
};
