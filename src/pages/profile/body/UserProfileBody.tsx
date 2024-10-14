import { Description, SectionTitle } from "../css/ProfileHeader.css";

import { BottomContainer } from "./css/ProviderBody.css";
import { UserProfile } from "../../../types/user";
import { useTranslation } from "react-i18next";
import { Box, Link, Typography } from "@mui/material";

type Props = {
  user: UserProfile;
};

export const UserProfileBody = ({ user }: Props) => {
  const { t } = useTranslation();
  const { description, email, phone, socials } = user;
  const parsedSocials = socials?.length ? JSON.parse(socials) : null;

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
        <div style={{ marginTop: 16 }}>
          <SectionTitle variant="h6">{t("profile.socials")}</SectionTitle>
          {parsedSocials
            .filter(({ username }) => username) // Filter out socials with empty username
            .map(({ platform, link, username }) => (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  mb: 2,
                }}
                key={platform}
              >
                {/* Platform Logo */}
                <img
                  src={`https://simpleicons.org/icons/${platform.toLowerCase()}.svg`}
                  alt={platform}
                  style={{ width: 24, height: 24, marginRight: 8 }} // Neater inline styling
                />

                {/* Username and Profile Link */}
                <Link
                  href={/^https?:\/\//.test(link) ? link : `https://${link}`} // Cleaner URL validation
                  target="_blank"
                  rel="noopener noreferrer"
                  underline="hover"
                >
                  <Typography variant="body1" color="primary">
                    {username}
                  </Typography>
                </Link>
              </Box>
            ))}
        </div>
      )}
    </BottomContainer>
  );
};
