import { Grid, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { SocialPlatform } from "../../../types/enums";
import { SocialProfile } from "../../../types/socialProfile";

type SocialsAccordionContentProps = {
  socials: string | undefined;
  setSocials: (socials: string | undefined) => void;
};

const createInitialSocialsFrom = (socials?: string) => {
  try {
    const parsedSocials = socials ? JSON.parse(socials) : [];
    // Ensure all platforms are represented even if some socials are missing
    return Object.keys(SocialPlatform).map((platform) => {
      const existingSocial = parsedSocials.find(
        (social: SocialProfile) => social.platform === platform,
      );
      return existingSocial || { platform, username: "", link: "" };
    });
  } catch (error) {
    console.error("Error parsing socials:", error);
    return createInitialSocials();
  }
};

const createInitialSocials = () => {
  return Object.keys(SocialPlatform).map((platform) => ({
    platform: platform as SocialPlatform,
    username: "",
    link: "",
  }));
};

const SocialsAccordionContent = ({
  socials,
  setSocials,
}: SocialsAccordionContentProps) => {
  const [socialsState, setSocialsState] = useState<SocialProfile[]>(
    createInitialSocials(),
  );

  useEffect(() => {
    setSocialsState(createInitialSocialsFrom(socials));
  }, [socials]);

  const handleSocialChange = (
    index: number,
    key: keyof SocialProfile,
    value: string,
  ) => {
    const updatedSocials = [...socialsState];
    if (key === "platform") {
      updatedSocials[index][key] = value as SocialPlatform;
    } else {
      updatedSocials[index][key] = value;
    }
    setSocialsState(updatedSocials);

    // Check if all socials have empty username and link
    const areAllFieldsEmpty = updatedSocials.every(
      (social) => !social.username && !social.link,
    );

    if (areAllFieldsEmpty) {
      setSocials(undefined); // Set socials to undefined if all fields are empty
      return;
    }
    // Only keep socials that have at least a username
    const socialsWithUsername = updatedSocials.filter(
      (social) => social.username,
    );
    setSocials(JSON.stringify(socialsWithUsername));
  };

  const { t } = useTranslation();

  return (
    <Grid container spacing={2}>
      {socialsState.map((social, index) => (
        <Grid container item spacing={2} key={index} alignItems="center">
          {/* Platform Logo */}
          <Grid
            item
            xs={12}
            sm={0.8}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <img
              src={`https://simpleicons.org/icons/${social.platform.toLowerCase()}.svg`}
              alt={social.platform}
              style={{ width: "24px", height: "24px" }}
            />
          </Grid>

          {/* Username Field */}
          <Grid item xs={12} sm={3.2}>
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
          <Grid item xs={12} sm={8}>
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
