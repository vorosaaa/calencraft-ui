import { Container, Grid, Typography } from "@mui/material";
import { Logo, Root } from "./Footer.css";
import { useNavigate } from "react-router-dom";
import { useBackgroundHook } from "../../hooks/backgroundHook";
import { useTranslation } from "react-i18next";

export const Footer = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { background } = useBackgroundHook();

  return (
    <Root
      sx={{
        backgroundColor: "rgba(40, 70, 100, 0.9)",
        background: background,
        backdropFilter: "blur(10px)",
      }}
    >
      <Container sx={{ marginBottom: 2 }} maxWidth="lg">
        {/* Upper Container */}
        <Grid container spacing={3}>
          {/* Our Company */}
          <Grid item xs={12} sm={4}>
            <div onClick={() => navigate("/termsofservice")}>
              <Typography sx={{ cursor: "pointer" }} variant="h6">
                {t("footer.termsOfService")}
              </Typography>
            </div>
          </Grid>
          <Grid item xs={12} sm={4}>
            <div onClick={() => navigate("/privacy")}>
              <Typography sx={{ cursor: "pointer" }} variant="h6">
                {t("footer.privacyPolicy")}
              </Typography>
            </div>
          </Grid>
          {/* Contact Information */}
          <Grid item xs={12} sm={4}>
            <div onClick={() => navigate("/contact")}>
              <Typography sx={{ cursor: "pointer" }} variant="h6">
                {t("footer.contactInformation")}
              </Typography>
            </div>
          </Grid>
        </Grid>
        {/* Lower Container */}
        <Container
          disableGutters
          maxWidth="lg"
          sx={{
            marginTop: 2,
            display: "flex",
            flexDirection: "row",
            alignContent: "center",
            alignItems: "center",
          }}
        >
          {/* Add your company logo */}
          <Logo src="/calencraft.png" alt="Company Logo" />
          <Typography variant="body2">
            {t("footer.copyright", { character: "&copy;" })}
          </Typography>
        </Container>
      </Container>
    </Root>
  );
};
