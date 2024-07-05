import { Title } from "../Header.css";
import { config } from "../../../config/config";
import { useNavigate } from "react-router-dom";

export const BrowserLogo = () => {
  const { NAME } = config;
  const navigate = useNavigate();

  const onClickTitle = () => navigate("/");

  return (
    <>
      <Title
        variant="h6"
        noWrap
        sx={{
          mr: 2,
          display: { xs: "none", md: "flex" },
        }}
        onClick={onClickTitle}
      >
        {NAME}
      </Title>
    </>
  );
};

export const MobileLogo = () => {
  const { NAME } = config;
  const navigate = useNavigate();

  const onClickTitle = () => navigate("/");
  return (
    <>
      <Title
        variant="subtitle1"
        noWrap
        sx={{
          mr: 2,
          display: { xs: "flex", md: "none" },
        }}
        onClick={onClickTitle}
      >
        {NAME}
      </Title>
    </>
  );
};
