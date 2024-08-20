import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";

type Props = {
  data?: any;
  isLoggedIn: () => boolean;
  anchorElNav?: HTMLElement | null;
  handleOpenNavMenu?: (event: React.MouseEvent<HTMLElement>) => void;
  handleCloseNavMenu: () => void;
};

export const BrowserMenu = ({
  data,
  isLoggedIn,
  handleCloseNavMenu,
}: Props) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const onClick = (url: string) => {
    handleCloseNavMenu();
    navigate(url);
  };

  const pages = useMemo(() => {
    return [
      { text: "header.book", url: "/search" },
      isLoggedIn() && { text: "header.calendar", url: "/calendar" },
      isLoggedIn() &&
        data?.user?.isProvider && {
          text: "header.new_booking",
          url: "/admin/booking",
        },
    ].filter(Boolean);
  }, [isLoggedIn, data]);

  return (
    <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
      {pages.map((page) => (
        <Button
          key={page.text}
          onClick={() => onClick(page.url)}
          sx={{ my: 2, color: "white" }}
        >
          {t(page.text)}
        </Button>
      ))}
    </Box>
  );
};

export const MobileMenu = ({
  isLoggedIn,
  data,
  anchorElNav,
  handleOpenNavMenu,
  handleCloseNavMenu,
}: Props) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const onClick = (url: string) => {
    handleCloseNavMenu();
    navigate(url);
  };

  const pages = useMemo(() => {
    return [
      { text: "header.book", url: "/search" },
      isLoggedIn() && { text: "header.calendar", url: "/calendar" },
      isLoggedIn() &&
        data?.user?.isProvider && { text: "header.pricing", url: "/myplan" },
    ].filter(Boolean);
  }, [isLoggedIn, data]);

  return (
    <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
      <IconButton
        size="large"
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleOpenNavMenu}
        color="inherit"
      >
        <MenuIcon />
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorElNav}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        open={Boolean(anchorElNav)}
        onClose={handleCloseNavMenu}
        sx={{
          display: { xs: "block", md: "none" },
        }}
      >
        {pages.map((page) => (
          <MenuItem key={page.text} onClick={() => onClick(page.url)}>
            <Typography textAlign="center"> {t(page.text)}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};
