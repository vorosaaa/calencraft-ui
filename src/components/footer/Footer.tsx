import React from "react";
import {
  Container,
  Grid,
  List,
  ListItem,
  ListItemProps,
  Typography,
} from "@mui/material";
import { Logo, Root, StyledListItemText } from "./Footer.css";
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
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            {/* Our Company */}
            <Grid item xs={12} sm={6}>
              <Typography variant="h6">{t("footer.company")}</Typography>
              <List>
                <StyledItem
                  label={t("footer.termsOfService")}
                  onClick={() => navigate("/termsofservice")}
                />
                <StyledItem
                  label={t("footer.privacyPolicy")}
                  onClick={() => navigate("/privacy")}
                />
                {/*<StyledItem
                  label={t("footer.aboutUs")}
                  onClick={() => navigate("/about")}
                />*/}
              </List>
            </Grid>
            {/* Contact Information */}
            <Grid item xs={12} sm={6}>
              <Typography variant="h6">
                {t("footer.contactInformation")}
              </Typography>
              <List>
                <Item>
                  <StyledListItemText
                    sx={{ cursor: "text" }}
                    primary={t("footer.contactName")}
                  />
                </Item>
                <Item>
                  <StyledListItemText
                    sx={{ cursor: "text" }}
                    primary={t("footer.contactEmail")}
                  />
                </Item>
              </List>
            </Grid>
          </Grid>
        </Container>
        {/* Lower Container */}
        <Container
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
          <Logo src="/images/new.svg" alt="Company Logo" />
          <Typography variant="body2">
            {t("footer.copyright", { character: "&copy;" })}
          </Typography>
        </Container>
      </Container>
    </Root>
  );
};

const Item = ({ children, ...props }: ListItemProps) => {
  return (
    <ListItem disableGutters disablePadding {...props}>
      {children}
    </ListItem>
  );
};

type ItemProps = { label: string; onClick: () => void };

const StyledItem = ({ label, onClick }: ItemProps) => {
  return (
    <Item onClick={onClick}>
      <StyledListItemText primary={label} />
    </Item>
  );
};
