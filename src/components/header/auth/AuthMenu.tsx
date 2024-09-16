import { IconButton, Typography } from "@mui/material";
import { useCheckMobileScreen } from "../../../hooks/screenHook";
import { HeaderButton } from "../Header.css";
import { Person } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export const AuthMenu = () => {
  const navigate = useNavigate();
  const isMobile = useCheckMobileScreen();
  const { t } = useTranslation();

  const handleLoginClick = () => navigate("/login");
  const handleRegistrationClick = () => navigate("/register");

  return isMobile ? (
    <IconButton onClick={handleLoginClick}>
      <Person />
    </IconButton>
  ) : (
    <>
      <HeaderButton onClick={handleLoginClick}>
        <Typography>{t("header.login")}</Typography>
      </HeaderButton>
      <HeaderButton onClick={handleRegistrationClick}>
        <Typography>{t("header.register")}</Typography>
      </HeaderButton>
    </>
  );
};
