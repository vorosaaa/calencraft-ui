import {
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import { useAuth } from "../../../hooks/authHook";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useMe } from "../../../queries/queries";
import { useEffect } from "react";

type Props = {
  anchorElUser: HTMLElement | null;
  handleOpenUserMenu: (event: React.MouseEvent<HTMLElement>) => void;
  handleCloseUserMenu: () => void;
};

export const HeaderAvatar = ({
  anchorElUser,
  handleOpenUserMenu,
  handleCloseUserMenu,
}: Props) => {
  const { removeAuth } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { data, error } = useMe();

  useEffect(() => {
    if (error) {
      removeAuth();
    }
  }, [error, removeAuth]);

  if (!data?.user)
    return (
      <IconButton sx={{ p: 0 }}>
        <Avatar alt="loading" />
      </IconButton>
    );

  const settings = [
    { title: "menu.profile", onClick: () => navigate("/myprofile") },
    { title: "menu.calendar", onClick: () => navigate("/calendar") },
    data.user.isProvider && {
      title: "menu.plan",
      onClick: () => navigate("/myplan"),
    },
    {
      title: "menu.logout",
      onClick: () => {
        removeAuth();
        navigate("/");
      },
    },
  ];

  const onMenuClick = (callback: () => void) => {
    callback();
    handleCloseUserMenu();
  };
  return (
    <Box>
      <Tooltip title="Open settings">
        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
          <Avatar alt={data.user.name} src={data.user.picUrl} />
        </IconButton>
      </Tooltip>
      <Menu
        sx={{ mt: "45px" }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        {settings.map(
          (setting) =>
            setting.title && (
              <MenuItem
                key={setting.title}
                onClick={() => onMenuClick(setting.onClick)}
              >
                <Typography textAlign="center">{t(setting.title)}</Typography>
              </MenuItem>
            ),
        )}
      </Menu>
    </Box>
  );
};
