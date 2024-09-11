import { IconButton, Typography } from "@mui/material";
import { useCheckMobileScreen } from "../../../hooks/screenHook";
import { HeaderButton } from "../Header.css";
import { Person } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

type Props = {
  onLoginClick: () => void;
  onRegistrationClick: () => void;
};

export const AuthMenu = ({ onLoginClick }: Props) => {
  const navigate = useNavigate();
  const isMobile = useCheckMobileScreen();
  const { t } = useTranslation();

  const handleLoginClick = () => {
    navigate('/login');
    onLoginClick();
  };

  const handleRegistrationClick = () => {
    navigate('/register');
    onLoginClick();
  };

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
