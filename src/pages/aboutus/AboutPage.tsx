import { Typography, Container, Paper } from "@mui/material";
import { useTranslation } from "react-i18next";

export const AboutUsPage = () => {
  const { t } = useTranslation();

  return (
    <Container maxWidth="md" style={{ marginTop: "50px" }}>
      <Paper elevation={8} style={{ padding: "20px" }}>
        <Typography variant="h4" gutterBottom>
          {t("aboutUsPage.aboutCalencraft")}
        </Typography>
        <Typography variant="body1" paragraph>
          {t("aboutUsPage.welcome")}
        </Typography>
        <Typography variant="body1" paragraph>
          {t("aboutUsPage.goal")}
        </Typography>
        <Typography variant="h6" gutterBottom>
          {t("aboutUsPage.whatDrivesUs")}
        </Typography>
        <Typography variant="body1" paragraph>
          {t("aboutUsPage.atCalencraft")}
        </Typography>
        <Typography variant="h6" gutterBottom>
          {t("aboutUsPage.whosBehind")}
        </Typography>
        <Typography variant="body1" paragraph>
          {t("aboutUsPage.whosBehindDescription")}
        </Typography>
        <Typography variant="body1" paragraph>
          {t("aboutUsPage.thankYouDescription")}
        </Typography>
      </Paper>
    </Container>
  );
};
