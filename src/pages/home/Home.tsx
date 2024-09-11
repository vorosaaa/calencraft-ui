import React from "react";
import {
  StartButton,
  Section,
  SectionTitle,
  SectionContent,
  SectionLayout,
  ImageWrapper,
  ContentWrapper,
} from "./Home.css";
import { Container, Divider, Typography } from "@mui/material";
import Carousel from "react-material-ui-carousel";
import { ImageCard } from "./ImageCard";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCheckMobileScreen } from "../../hooks/screenHook";

const images = [
  { image: "/images/barber.jpeg", title: "Calendar Management" },
  { image: "/images/fitness.jpeg", title: "Subscriptions" },
  { image: "/images/cosmetics.jpeg", title: "Email Notifications" },
];

export const Home: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isMobile = useCheckMobileScreen();

  // Reusable render function with optional reverse layout
  const renderFeatureSection = (
    titleKey: string,
    contentKey: string,
    imgSrc: string,
    reverse = false,
    contentKey2?: string,
  ) => {
    return (
      <Section container>
        <SectionLayout item xs={12} isMobile={isMobile} reverse={reverse}>
          <ImageWrapper>
            <img src={imgSrc} alt={t(`home.sections.${titleKey}`)} />
          </ImageWrapper>
          <ContentWrapper>
            <SectionTitle variant="h4">
              {t(`home.sections.${titleKey}`)}
            </SectionTitle>
            <SectionContent>{t(`home.sections.${contentKey}`)}</SectionContent>
            {contentKey2 && (
              <SectionContent sx={{ marginTop: 2 }}>
                {t(`home.sections.${contentKey2}`)}
              </SectionContent>
            )}
          </ContentWrapper>
        </SectionLayout>
      </Section>
    );
  };

  return (
    <Container disableGutters maxWidth="xl">
      <div style={{ minHeight: "85", width: "100%" }}>
        <Carousel
          sx={{ width: "100%" }}
          autoPlay={true}
          duration={800}
          animation="slide"
        >
          {images?.map((image, index) => <ImageCard key={index} {...image} />)}
        </Carousel>
        {/* Welcome Section */}
        <Container maxWidth="md">
          <Typography
            sx={{ marginBottom: 2, marginTop: 2 }}
            variant="h4"
            align="center"
          >
            {t("home.welcomeTitle")}
          </Typography>
          <Typography
            sx={{ textAlign: "center", marginBottom: 2 }}
            variant="body1"
          >
            {t("home.welcomeText")}
            <Typography
              sx={{ textAlign: "center", marginBottom: 2, marginTop: 2 }}
              variant="body1"
            >
              {t("home.welcomeText2")}
            </Typography>
          </Typography>
        </Container>
      </div>

      {/* Feature Sections */}
      {renderFeatureSection(
        "calendarManagement",
        "calendarManagementDescription",
        "/images/calendar.jpg",
      )}
      <Divider variant="middle" />
      {renderFeatureSection(
        "noMoreNoShows",
        "noMoreNoShowsDescription",
        "/images/question.png",
        true,
      )}
      <Divider variant="middle" />
      {renderFeatureSection(
        "subscriptions",
        "subscriptionsDescription",
        "/images/plans.png",
        false,
        "subscriptionsDescription2",
      )}
      <Divider variant="middle" />
      {renderFeatureSection(
        "simpleScheduling",
        "simpleSchedulingDescription",
        "/images/booking.png",
        true,
        "simpleSchedulingDescription2",
      )}
      <Divider variant="middle" />
      {/* Reversed layout */}
      {renderFeatureSection(
        "emailNotifications",
        "emailNotificationsDescription",
        "/images/email.jpg",
        false,
        "emailNotificationsDescription2",
      )}
      <Divider variant="middle" />

      {/* Why Choose Us */}

      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography
          sx={{ marginBottom: 2, marginTop: 2 }}
          variant="h5"
          align="center"
        >
          {t("home.whyChooseTitle")}
        </Typography>
        <ul>
          <li>{t("home.reasons.easyScheduling")}</li>
          <li>{t("home.reasons.flexiblePlans")}</li>
          <li>{t("home.reasons.comprehensiveSupport")}</li>
          <li>{t("home.reasons.increasedVisibility")}</li>
        </ul>
        {/* Call to Action */}
        <StartButton
          onClick={() => navigate("/search")}
          variant="contained"
          color="primary"
          size="large"
        >
          {t("home.getStartedButton")}
        </StartButton>
      </Container>
    </Container>
  );
};
