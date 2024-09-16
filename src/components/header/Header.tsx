import { AppBar, Container, CssBaseline, Toolbar } from "@mui/material";

import { useAuth } from "../../hooks/authHook";
import { BrowserLogo, MobileLogo } from "./logo/Logo";
import { BrowserMenu, MobileMenu } from "./menu/HeaderMenu";
import LanguageSelector from "./language-selector/LanguageSelector";
import { useState } from "react";
import { HeaderAvatar } from "./avatar/HeaderAvatar";
import { AuthMenu } from "./auth/AuthMenu";
import { useBackgroundHook } from "../../hooks/backgroundHook";
import { useMe } from "../../queries/queries";
import i18n, { dynamicActivate } from "../../i18n";

export const Header = () => {
  const [language, setLanguage] = useState<string>(i18n.language);
  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    dynamicActivate(newLanguage);
  };

  const { isLoggedIn } = useAuth();
  const { data } = useMe();

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
            <AuthMenu />
          )}
          <LanguageSelector
            currentLanguage={language}
            onChangeLanguage={handleLanguageChange}
          />
        </Toolbar>
      </Container>
    </AppBar>
  );
};
