import { AppBar, Container, CssBaseline, Toolbar } from "@mui/material";

import { useAuth } from "../../hooks/authHook";
import { BrowserLogo, MobileLogo } from "./logo/Logo";
import { BrowserMenu, MobileMenu } from "./menu/HeaderMenu";
import { useState } from "react";
import { HeaderAvatar } from "./avatar/HeaderAvatar";
import { AuthMenu } from "./auth/AuthMenu";
import { useBackgroundHook } from "../../hooks/backgroundHook";
import { useMe } from "../../queries/queries";

type Props = {
  onLoginClick: () => void;
  onRegistrationClick: () => void;
};

export const Header = (props: Props) => {
  const { isLoggedIn } = useAuth();
  const { data } = useMe();
  const { onLoginClick, onRegistrationClick } = props;

  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorElNav(event.currentTarget);
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorElUser(event.currentTarget);
  const handleCloseNavMenu = () => setAnchorElNav(null);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  const { background } = useBackgroundHook();

  return (
    <AppBar
      sx={{
        backgroundColor: "rgba(40, 70, 100, 0.9)",
        background: background,
        backdropFilter: "blur(10px)",
      }}
      position="sticky"
    >
      <CssBaseline />
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <BrowserLogo />
          <BrowserMenu
            isLoggedIn={isLoggedIn}
            data={data}
            handleCloseNavMenu={handleCloseNavMenu}
          />

          <MobileMenu
            isLoggedIn={isLoggedIn}
            data={data}
            anchorElNav={anchorElNav}
            handleOpenNavMenu={handleOpenNavMenu}
            handleCloseNavMenu={handleCloseNavMenu}
          />
          <MobileLogo />

          {isLoggedIn() ? (
            <HeaderAvatar
              anchorElUser={anchorElUser}
              handleOpenUserMenu={handleOpenUserMenu}
              handleCloseUserMenu={handleCloseUserMenu}
            />
          ) : (
            <AuthMenu
              onLoginClick={onLoginClick}
              onRegistrationClick={onRegistrationClick}
            />
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};
