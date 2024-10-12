import { Description, SectionTitle } from "../css/ProfileHeader.css";

import { BottomContainer, CertificationList } from "./css/ProviderBody.css";
import { UserProfile } from "../../../types/user";
import { useTranslation } from "react-i18next";
import { Grid, Link, Typography } from "@mui/material";

type Props = {
  user: UserProfile;
};

export const UserProfileBody = ({ user }: Props) => {
  const { t } = useTranslation();
  const { description, goals, email, phone, socials } = user;
  const parsedSocials = socials ? JSON.parse(socials) : null;

  return (
    <BottomContainer
      sx={{
        flexDirection: "column",
        textAlign: "center",
      }}
    >
      {description && (
        <>
          <SectionTitle variant="h6">{t("profile.aboutme")}</SectionTitle>
          <Description variant="body1">{description}</Description>
        </>
      )}
      <>
        <SectionTitle variant="h6">{t("profile.contact")}</SectionTitle>
        <Description variant="body1">{email}</Description>
        {phone && <Description variant="body1">{phone}</Description>}
      </>
      {Array.isArray(parsedSocials) && parsedSocials !== null && (
        <>
          <SectionTitle variant="h6" style={{ textAlign: "center" }}>
            {t("profile.socials")}
          </SectionTitle>
          <Grid
            container
            spacing={1}
            alignItems="center"
            justifyContent="center"
          >
            {parsedSocials
              .filter(({ username, link }) => username && link) // Filter out socials with empty username or link
              .map(({ platform, link, username }) => (
                <Grid item xs={12} key={platform}>
                  <Grid
                    container
                    alignItems="center"
                    spacing={2}
                    justifyContent="center"
                  >
                    {/* Platform Logo */}
                    <Grid item>
                      <img
                        src={`https://simpleicons.org/icons/${platform.toLowerCase()}.svg`}
                        alt={platform}
                        style={{ width: 24, height: 24 }} // Neater inline styling
                      />
                    </Grid>

                    {/* Username and Profile Link */}
                    <Grid item>
                      <Link
                        href={
                          /^https?:\/\//.test(link) ? link : `https://${link}`
                        } // Cleaner URL validation
                        target="_blank"
                        rel="noopener noreferrer"
                        underline="hover"
                      >
                        <Typography variant="body1" color="primary">
                          {username}
                        </Typography>
                      </Link>
                    </Grid>
                  </Grid>
                </Grid>
              ))}
          </Grid>
        </>
      )}

      {goals?.length !== 0 && <SectionTitle variant="h6">Goals</SectionTitle>}
      <CertificationList>
        {goals?.map((goal, index) => <li key={index}>{goal}</li>)}
      </CertificationList>
    </BottomContainer>
  );
};
