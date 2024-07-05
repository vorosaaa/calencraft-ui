import React from "react";
import { IntroText, StartButton, Title, View } from "./Home.css";
import { Grid } from "@mui/material";
import Carousel from "react-material-ui-carousel";
import { ImageCard } from "./ImageCard";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const images = [
  { image: "/images/barber.jpeg", title: "barbershop" },
  { image: "/images/fitness.jpeg", title: "fitness" },
  { image: "/images/cosmetics.jpeg", title: "cosmetics" },
];

export const Home: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const renderReason = (firstWordKey: string, restKey: string) => {
    return (
      <>
        <strong>{t(`home.reasons.${firstWordKey}`)}</strong>
        {": "}
        {t(`home.reasons.${restKey}`)}
      </>
    );
  };
  return (
    <View maxWidth="lg">
      <Grid container justifyContent="center">
        <Grid item xs={12} sm={10}>
          <Carousel autoPlay={true} duration={800} animation="slide">
            {images?.map((image, index) => (
              <ImageCard key={index} {...image} />
            ))}
          </Carousel>
        </Grid>
      </Grid>
      <Title variant="h4" align="center">
        {t("home.welcomeTitle")}
      </Title>
      <IntroText variant="body1">{t("home.welcomeText1")}</IntroText>
      <IntroText variant="body1">{t("home.welcomeText2")}</IntroText>
      <Title variant="h6" align="center">
        {t("home.whyChooseTitle")}
      </Title>
      <ul>
        <li>
          {renderReason("simpleSchedulingFirstWord", "simpleSchedulingRest")}
        </li>
        <li>
          {renderReason("diverseSelectionFirstWord", "diverseSelectionRest")}
        </li>
        <li>{renderReason("expertGuidanceFirstWord", "expertGuidanceRest")}</li>
        <li>{renderReason("tailoredPlansFirstWord", "tailoredPlansRest")}</li>
      </ul>
      <StartButton
        onClick={() => navigate("/search")}
        variant="contained"
        color="primary"
        size="large"
      >
        {t("home.getStartedButton")}
      </StartButton>
    </View>
  );
};
