import React, { useEffect } from "react";
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
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCheckMobileScreen } from "../../hooks/screenHook";

const images = [
  { image: "/images/barber.webp", title: "Calendar Management" },
  { image: "/images/fitness.webp", title: "Subscriptions" },
  { image: "/images/cosmetics.webp", title: "Email Notifications" },
];

export const Home: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isMobile = useCheckMobileScreen();

  useEffect(() => {
    const imagesToPreload = ["/images/calendar.webp", "/images/barber.webp"];

    imagesToPreload.forEach((image) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.href = image;
      link.as = "image";
      document.head.appendChild(link);
    });
  }, []);

  // Reusable render function with optional reverse layout
  const renderFeatureSection = (
    titleKey: string,
    contentKey: string,
    imgSrc: string,
    reverse?: boolean,
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
      <div style={{ width: "100%" }}>
        <Carousel
          sx={{ width: "100%" }}
          autoPlay={true}
          interval={5000}
          duration={1000}
          indicators={false}
          animation="slide"
        >
          {images?.map((image, index) => (
            <img
              key={index}
              src={image.image}
              alt={image.title}
              style={{ width: "100%", height: 360, objectFit: "cover" }}
            />
          ))}
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
          <div style={{ textAlign: "center", marginBottom: 2 }}>
            <Typography variant="body1">{t("home.welcomeText")}</Typography>
            <Typography sx={{ marginBottom: 2, marginTop: 2 }} variant="body1">
              {t("home.welcomeText2")}
            </Typography>
          </div>
        </Container>
      </div>

      {/* Feature Sections */}
      {renderFeatureSection(
        "calendarManagement",
        "calendarManagementDescription",
        "/images/calendar.webp",
      )}
      <Divider variant="middle" />
      {renderFeatureSection(
        "noMoreNoShows",
        "noMoreNoShowsDescription",
        "/images/question.webp",
        true,
      )}
      <Divider variant="middle" />
      {renderFeatureSection(
        "userManagement",
        "userManagementDescription",
        "/images/users.webp",
        false,
        "userManagementDescription2",
      )}
      <Divider variant="middle" />
      {renderFeatureSection(
        "subscriptions",
        "subscriptionsDescription",
        "/images/plans.webp",
        true,
        "subscriptionsDescription2",
      )}
      <Divider variant="middle" />
      {renderFeatureSection(
        "simpleScheduling",
        "simpleSchedulingDescription",
        "/images/booking.webp",
        false,
        "simpleSchedulingDescription2",
      )}
      <Divider variant="middle" />
      {/* Reversed layout */}
      {renderFeatureSection(
        "emailNotifications",
        "emailNotificationsDescription",
        "/images/email.webp",
        true,
        "emailNotificationsDescription2",
      )}
      <Divider variant="middle" />
      {renderFeatureSection(
        "help",
        "helpDescription",
        "/images/support.webp",
        false,
        "helpDescription2",
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
          onClick={() => navigate("/register")}
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
