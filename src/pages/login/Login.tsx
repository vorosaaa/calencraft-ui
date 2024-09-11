import React, { useEffect, useState } from "react";
import {
  IconButton,
  TextField,
  Typography,
} from "@mui/material";

import { ArrowBack, Visibility, VisibilityOff } from "@mui/icons-material";
import { login } from "../../api/authApi";
import {
  FormParent,
  SubmitButton,
  StyledContainer,
  CarouselBox,
  FormBox,
  BackButton,
} from "./Login.css";
import { useMutation, useQueryClient } from "react-query";
import { useAuth } from "../../hooks/authHook";
import { useTranslation } from "react-i18next";
import { useCheckMobileScreen } from "../../hooks/screenHook";
import { useVerificationModalHook } from "../../hooks/verificationHook";
import { VerificationMode } from "../../types/enums";
import { useNavigate } from "react-router-dom";
import Carousel from "react-material-ui-carousel";

const carouselImages = [
  "/images/barber.jpeg",
  "/images/fitness.jpeg",
  "/images/cosmetics.jpeg",
];

const CarouselCard = ({ src }: { src: string }) => (
  <img
    src={src}
    alt="carousel"
    style={{ width: "100%", height: "100%", objectFit: "cover" }}
  />
);

export const Login: React.FC = () => {
  const { t } = useTranslation();
  const { setVerification } = useVerificationModalHook();
  const { saveAuth } = useAuth();
  const queryClient = useQueryClient();
  const isMobile = useCheckMobileScreen();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { mutate } = useMutation(login, {
    onSuccess: (data) => {
      saveAuth(data.token);
      setEmail("");
      setPassword("");
      queryClient.invalidateQueries("me");
      navigate("/");
    },
  });

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };

  const handleForgotPassword = () => {
    setEmail("");
    setPassword("");
    setVerification(
      true,
      VerificationMode.FORGOT_PASSWORD,
      VerificationMode.FORGOT_PASSWORD,
    );
  };

  const handleLogin = async () => {
    mutate({ email, password });
  };

  const onRegistrationClick = () => {
    navigate("/register");
  };

  useEffect(() => {
    if (!email || !password) return;
    const keyDownHandler = (event: any) => {
      if (event.key === "Enter") {
        event.preventDefault();
        handleLogin();
      }
    };

    document.addEventListener("keydown", keyDownHandler);
    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, [email, password]);

  const sliderSettings = {
    autoplay: true,
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <StyledContainer>
      <BackButton onClick={() => navigate(-1)}>
        <ArrowBack />
      </BackButton>
      <FormBox>
        <Typography variant="h4" align="center">
          {t("login.title")}
        </Typography>
        <FormParent>
          <TextField
            label={t("login.email")}
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            variant="outlined"
          />
          <TextField
            label={t("login.password")}
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type={showPassword ? "text" : "password"}
            margin="normal"
            variant="outlined"
            sx={{ mb: 0 }}
            InputProps={{
              endAdornment: (
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              ),
            }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "right",
            }}
            onClick={handleForgotPassword}
          >
            <Typography sx={{ cursor: "pointer" }} variant="caption">
              {t("login.forgot")}
            </Typography>
          </div>
          <SubmitButton
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleLogin}
          >
            {t("login.button")}
          </SubmitButton>
          <div onClick={onRegistrationClick}>
            <Typography sx={{ cursor: "pointer", textAlign: "center" }}>
              {t("login.register")}
            </Typography>
          </div>
        </FormParent>
      </FormBox>
      <CarouselBox>
        <Carousel
          autoPlay={true}
          interval={3000}
          duration={800}
          animation="slide"
          height={"100vh"}
          indicators={false}
        >
          {carouselImages.map((src, index) => (
            <CarouselCard key={index} src={src} />
          ))}
        </Carousel>
      </CarouselBox>
    </StyledContainer>
  );
};
