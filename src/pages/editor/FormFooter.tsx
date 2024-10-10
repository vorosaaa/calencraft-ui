import { CheckCircleOutline, MoreHoriz } from "@mui/icons-material";
import {
  Button,
  CircularProgress,
  Container,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useMe } from "../../queries/queries";
import { colors } from "../../theme/colors";

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
  const { data } = useMe();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [linkCopied, setLinkCopied] = useState(false);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) =>
    setAnchorEl(event.currentTarget);
  const handleCopyLink = () => {
    const host = window.location.host;
    const protocol = window.location.protocol;
    const identifier = data.user.slug || data.user.id || "";
    const profileUrl = `${protocol}//${host}/profile/${identifier}`;
    const pageUrl = `${protocol}//${host}`;
    navigator.clipboard.writeText(profileUrl ? profileUrl : pageUrl);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 10000);
  };

  const handleClose = () => setAnchorEl(null);
  const handleRemoveAccount = () => {
    handleDeleteOpen();
    handleClose();
  };
  return (
    <Container
      disableGutters
      sx={{
        display: "flex",
        justifyContent: "space-between",
        mt: 2,
      }}
    >
      <Button
        variant="contained"
        sx={{ px: 6 }}
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
          sx={{ ".MuiMenu-list": { p: 0 } }}
        >
          {linkCopied ? (
            <MenuItem
              sx={{ px: 4, py: 2, color: "success.main" }}
              onClick={handleCopyLink}
            >
              {t("editor.shared")}
              <CheckCircleOutline sx={{ ml: 1 }} />
            </MenuItem>
          ) : (
            <MenuItem sx={{ px: 4, py: 2 }} onClick={handleCopyLink}>
              {t("editor.share")}
            </MenuItem>
          )}
          <MenuItem
            sx={{
              px: 4,
              py: 2,
              bgcolor: "error.main",
              color: colors.white,
              "&:hover": {
                bgcolor: "error.light",
              },
            }}
            onClick={handleRemoveAccount}
          >
            {t("editor.remove")}
          </MenuItem>
        </Menu>
      </div>
    </Container>
  );
};
