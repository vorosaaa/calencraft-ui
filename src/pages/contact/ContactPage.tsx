import { Typography, Container, Paper } from "@mui/material";
import { useTranslation } from "react-i18next";

export const ContactPage = () => {
  const { t } = useTranslation();

  return (
    <Container maxWidth="sm" style={{ marginTop: "50px" }}>
      <Paper elevation={8} style={{ padding: "20px", textAlign: "center" }}>
        <img style={{ width: 120 }} src="/calencraft.png" alt="Company Logo" />
        <Container>
          <Typography variant="h6">{t("contact.name")}</Typography>
          <Typography variant="body1">{t("contact.email")}</Typography>
          <Typography variant="body1">{t("contact.tax_number")}</Typography>
        </Container>
      </Paper>
    </Container>
  );
};
