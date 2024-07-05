import React, { useState } from "react";
import {
  Button,
  Container,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { EmailStatus } from "../../types/enums";
import { AddressAccordionContent } from "./accordions/AddressAccordionContent";
import { UserPersonalContent } from "./accordions/UserPersonalContent";
import { FormState } from "../../types/formState";
import { useTranslation } from "react-i18next";
import { MoreHoriz } from "@mui/icons-material";

type Props = {
  formData: FormState;
  openVerificationModal: () => void;
  handleSubmit: () => void;
  handleDeleteOpen: () => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const UserEditorForm = ({
  formData,
  openVerificationModal,
  handleSubmit,
  handleDeleteOpen,
  handleInputChange,
}: Props) => {
  const { t } = useTranslation();
  const { name, emailStatus, phoneNumber, description, address } = formData;
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
    <Container maxWidth="sm" sx={{ marginBottom: 2 }}>
      {emailStatus === EmailStatus.NOT_CONFIRMED && (
        <Button
          sx={{ mb: 2 }}
          fullWidth
          variant="outlined"
          color="warning"
          onClick={openVerificationModal}
        >
          {t("editor.verify_email")}
        </Button>
      )}
      <UserPersonalContent
        name={name}
        phoneNumber={phoneNumber}
        description={description}
        handleInputChange={handleInputChange}
      />
      {address && (
        <Divider variant="middle" sx={{ mb: 4, mt: 4 }}>
          <Typography variant="body2">{t("editor.address")}</Typography>
        </Divider>
      )}
      {address && (
        <AddressAccordionContent
          address={address}
          handleInputChange={handleInputChange}
        />
      )}

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
            <MoreHoriz />
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
    </Container>
  );
};
