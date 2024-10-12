import { Grid, TextField, MenuItem } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const socialPlatforms = ["Facebook", "Instagram", "Tiktok"];

type SocialProfile = {
  platform: string;
  username: string;
  link: string;
};

type SocialsAccordionContentProps = {
  socials: string | undefined;
  setSocials: (socials: string | undefined) => void;
};

const SocialsAccordionContent = ({
  socials,
  setSocials,
}: SocialsAccordionContentProps) => {
  // Parse or initialize socials
  const initialSocials: SocialProfile[] = (() => {
    try {
      const parsedSocials = socials ? JSON.parse(socials) : [];
      // Ensure all platforms are represented even if some socials are missing
      return socialPlatforms.map((platform) => {
        const existingSocial = parsedSocials.find(
          (social: SocialProfile) => social.platform === platform,
        );
        return existingSocial || { platform, username: "", link: "" };
      });
    } catch (error) {
      console.error("Error parsing socials:", error);
      return socialPlatforms.map((platform) => ({
        platform,
        username: "",
        link: "",
      }));
    }
  })();

  const [socialsState, setSocialsState] =
    useState<SocialProfile[]>(initialSocials);

  const handleSocialChange = (
    index: number,
    key: keyof SocialProfile,
    value: string,
  ) => {
    const updatedSocials = [...socialsState];
    updatedSocials[index][key] = value;
    setSocialsState(updatedSocials);

    // Check if all socials have empty username and link
    const areAllFieldsEmpty = updatedSocials.every(
      (social) => !social.username && !social.link,
    );

    if (areAllFieldsEmpty) {
      setSocials(undefined); // Set socials to undefined if all fields are empty
    } else {
      // Only keep socials that have at least a username
      const socialsWithUsername = updatedSocials.filter(
        (social) => social.username,
      );
      setSocials(JSON.stringify(socialsWithUsername));
    }
  };

  const { t } = useTranslation();

  return (
    <Grid container spacing={2}>
      {socialsState.map((social, index) => (
        <Grid container item spacing={2} key={index} alignItems="center">
          {/* Platform Logo */}
          <Grid item xs={12} lg={1}>
            <MenuItem>
              <img
                src={`https://simpleicons.org/icons/${social.platform.toLowerCase()}.svg`}
                alt={social.platform}
                style={{ width: "24px", height: "24px" }}
              />
            </MenuItem>
          </Grid>

          {/* Username Field */}
          <Grid item xs={12} lg={5}>
            <TextField
              fullWidth
              label={t("editor.username")}
              value={social.username}
              onChange={(e) =>
                handleSocialChange(index, "username", e.target.value)
              }
            />
          </Grid>

          {/* Link Field - Always editable */}
          <Grid item xs={12} lg={6}>
            <TextField
              fullWidth
              label="Link"
              value={social.link}
              onChange={(e) =>
                handleSocialChange(index, "link", e.target.value)
              }
            />
          </Grid>
        </Grid>
      ))}
    </Grid>
  );
};

export default SocialsAccordionContent;
