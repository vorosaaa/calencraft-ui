import { IconButton, Typography } from "@mui/material";
import { useCheckMobileScreen } from "../../../hooks/screenHook";
import { HeaderButton } from "../Header.css";
import { Person } from "@mui/icons-material";
import { useTranslation } from "react-i18next";

type Props = {
  onLoginClick: () => void;
  onRegistrationClick: () => void;
};

export const AuthMenu = ({ onLoginClick, onRegistrationClick }: Props) => {
  const isMobile = useCheckMobileScreen();
  const { t } = useTranslation();
  return isMobile ? (
    <IconButton onClick={onLoginClick}>
      <Person />
    </IconButton>
  ) : (
    <>
      <HeaderButton onClick={onLoginClick}>
        <Typography>{t("header.login")}</Typography>
      </HeaderButton>
      <HeaderButton onClick={onRegistrationClick}>
        <Typography>{t("header.register")}</Typography>
      </HeaderButton>
    </>
  );
};
