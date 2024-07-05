import { Container, Paper, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

export const TermsOfServicePage = () => {
  const { t } = useTranslation();
  return (
    <Container maxWidth="md" style={{ marginTop: "50px" }}>
      <Paper elevation={8} style={{ padding: "20px" }}>
        <Typography variant="h4" gutterBottom>
          {t("termsOfService.title")}
        </Typography>
        <Typography variant="body1" paragraph>
          {t("termsOfService.welcome")}
        </Typography>
        <Typography variant="h6" gutterBottom>
          {t("termsOfService.booking_services")}
        </Typography>
        <Typography variant="body1" paragraph>
          {t("termsOfService.booking_services_content")}
        </Typography>
        <Typography variant="h6" gutterBottom>
          {t("termsOfService.user_responsibility")}
        </Typography>
        <Typography variant="body1" paragraph>
          {t("termsOfService.user_responsibility_content")}
        </Typography>
        <Typography variant="h6" gutterBottom>
          {t("termsOfService.provider_responsibility")}
        </Typography>
        <Typography variant="body1" paragraph>
          {t("termsOfService.provider_responsibility_content")}
        </Typography>
        <Typography variant="h6" gutterBottom>
          {t("termsOfService.payment_terms")}
        </Typography>
        <Typography variant="body1" paragraph>
          {t("termsOfService.payment_terms_content")}
        </Typography>
        <Typography variant="h6" gutterBottom>
          {t("termsOfService.disclaimer")}
        </Typography>
        <Typography variant="body1" paragraph>
          {t("termsOfService.disclaimer_content")}
        </Typography>
        <Typography variant="h6" gutterBottom>
          {t("termsOfService.changes_to_terms")}
        </Typography>
        <Typography variant="body1" paragraph>
          {t("termsOfService.changes_to_terms_content")}
        </Typography>
        <Typography variant="body1" paragraph>
          {t("termsOfService.acceptance_of_terms")}
        </Typography>
        <Typography variant="body1" paragraph>
          {t("termsOfService.contact_us")}
        </Typography>
      </Paper>
    </Container>
  );
};
