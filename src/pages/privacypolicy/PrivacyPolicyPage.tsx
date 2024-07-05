import { Container, Paper, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

export const PrivacyPolicyPage = () => {
  const { t } = useTranslation();
  return (
    <Container maxWidth="md" style={{ marginTop: "50px" }}>
      <Paper elevation={8} style={{ padding: "20px" }}>
        <Typography variant="h4" gutterBottom>
          {t("privacyPolicy.title")}
        </Typography>
        <Typography variant="body1" paragraph>
          {t("privacyPolicy.intro")}
        </Typography>
        <Typography variant="h6" gutterBottom>
          {t("privacyPolicy.data_collection")}
        </Typography>
        <Typography variant="body1" paragraph>
          {t("privacyPolicy.data_collection_content")}
        </Typography>
        <Typography variant="body1" paragraph>
          {t("privacyPolicy.no_marketing")}
        </Typography>
        <Typography variant="h6" gutterBottom>
          {t("privacyPolicy.virtual_profiles")}
        </Typography>
        <Typography variant="body1" paragraph>
          {t("privacyPolicy.virtual_profiles_content")}
        </Typography>
        <Typography variant="h6" gutterBottom>
          {t("privacyPolicy.payment_data_security")}
        </Typography>
        <Typography variant="body1" paragraph>
          {t("privacyPolicy.payment_data_security_content")}
        </Typography>
        <Typography variant="body1" paragraph>
          {t("privacyPolicy.check_privacy_policy")}
        </Typography>
      </Paper>
    </Container>
  );
};
