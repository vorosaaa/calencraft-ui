import { Description, SectionTitle } from "../css/ProfileHeader.css";
import { BookingStepper } from "./stepper/BookingStepper";
import { useCheckMobileScreen } from "../../../hooks/screenHook";
import {
  BottomContainer,
  BottomLeftContainer,
  BottomRightContainer,
} from "./css/ProviderBody.css";
import { UserProfile } from "../../../types/user";
import { useTranslation } from "react-i18next";
import { Grid, Link, Typography } from "@mui/material";

type Props = {
  user: UserProfile;
};

export const ProviderProfileBody = ({ user }: Props) => {
  const { description, email, phone, socials } = user;
  const isMobile = useCheckMobileScreen();
  const { t } = useTranslation();
  const parsedSocials = socials ? JSON.parse(socials) : null;

  return (
    <BottomContainer
      sx={{
        flexDirection: isMobile ? "column" : "row",
        textAlign: isMobile ? "center" : "left",
      }}
    >
      <BottomLeftContainer>
        {description && (
          <SectionTitle variant="h6">{t("profile.aboutme")}</SectionTitle>
        )}
        <Description variant="body1">{description}</Description>
        {/*<SectionTitle variant="h6">{t("profile.certificates")}</SectionTitle>
        <CertificationList>
          <li>Certification 1</li>
          <li>Certification 2</li>
          <li>Certification 3</li>
        </CertificationList>*/}
        <SectionTitle variant="h6">{t("profile.contact")}</SectionTitle>
        <Typography>{email}</Typography>
        <Typography>{phone}</Typography>
        {Array.isArray(parsedSocials) && parsedSocials !== null && (
          <>
            <SectionTitle variant="h6">{t("profile.socials")}</SectionTitle>
            <Grid container spacing={1} alignItems="center">
              {parsedSocials
                .filter(({ username }) => username) // Filter out socials with empty username
                .map(({ platform, link, username }) => (
                  <Grid item xs={12} key={platform}>
                    <Grid container alignItems="center" spacing={2}>
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
      </BottomLeftContainer>
      <BottomRightContainer>
        <BookingStepper provider={user} />
      </BottomRightContainer>
    </BottomContainer>
  );
};
