import { Grid, TextField } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { SocialPlatform } from "../../../types/enums";
import { SocialProfile } from "../../../types/socialProfile";
import { useFormContext } from "react-hook-form";
import { FormState } from "../../../types/formState";
import { useCheckMobileScreen } from "../../../hooks/screenHook";

const createInitialSocialsFrom = (socials?: string) => {
  try {
    const parsedSocials =
      typeof socials === "object"
        ? []
        : (JSON.parse(socials || "[]") as SocialProfile[]);
    // Ensure all platforms are represented even if some socials are missing
    return Object.keys(SocialPlatform).map((platform) => {
      const existingSocial = parsedSocials.find(
        (social: SocialProfile) => social.platform === platform,
      );
      return (
        existingSocial || {
          platform: platform as SocialPlatform,
          username: "",
          link: "",
        }
      );
    });
  } catch (error) {
    console.error("Error parsing socials: " + error);
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

const SocialsAccordionContent = () => {
  const isMobile = useCheckMobileScreen();
  const [errors, setErrors] = useState<Record<number, string>>({});
  const { watch, setValue } = useFormContext<Partial<FormState>>();

  const socials = watch("socials") as string;
  const socialState = useMemo(
    () => createInitialSocialsFrom(socials),
    [socials],
  );

  useEffect(() => {
    const initialValues = createInitialSocialsFrom(socials);
    //@ts-ignore
    setValue("socials", JSON.stringify(initialValues));
  }, []);

  const handleSocialChange = (
    index: number,
    key: keyof SocialProfile,
    value: string | SocialPlatform,
  ) => {
    const updatedSocials = [...socialState];
    updatedSocials[index] = {
      ...updatedSocials[index],
      [key]: value,
    };

    if (key === "link" && value && !updatedSocials[index].username) {
      setErrors((prev) => ({
        ...prev,
        [index]: t("editor.errors.username_required"),
      }));
    } else if (key === "username") {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[index];
        return newErrors;
      });
    }

    if (key === "username") {
      if (!value && updatedSocials[index].link) {
        setErrors((prev) => ({
          ...prev,
          [index]: t("editor.errors.username_required"),
        }));
      } else {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[index];
          return newErrors;
        });
      }
    }

    // Check if all socials have empty username and link
    const areAllFieldsEmpty =
      updatedSocials?.every((social) => !social.username && !social.link) ??
      true;

    if (areAllFieldsEmpty) {
      return undefined;
    }
    return JSON.stringify(updatedSocials);
  };

  const { t } = useTranslation();

  return (
    <Grid container spacing={2}>
      {socialState?.map((social, index) => (
        <Grid container item spacing={2} key={index} alignItems="flex-start">
          {/* Platform Logo */}
          <Grid
            item
            xs={12}
            sm={0.8}
            sx={{
              marginTop: isMobile ? 0 : 2,
              display: "flex",
              justifyContent: "center",
            }}
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
              value={social.username}
              label={t("editor.username")}
              error={!!errors[index]}
              helperText={errors[index]}
              onChange={(e) => {
                const transformedValues = handleSocialChange(
                  index,
                  "username",
                  e.target.value,
                );
                //@ts-ignore
                setValue("socials", transformedValues);
              }}
            />
          </Grid>

          {/* Link Field - Always editable */}
          <Grid item xs={12} sm={8}>
            <TextField
              fullWidth
              label="Link"
              value={social.link}
              onChange={(e) => {
                const transformedValues = handleSocialChange(
                  index,
                  "link",
                  e.target.value,
                );
                //@ts-ignore
                setValue("socials", transformedValues);
              }}
            />
          </Grid>
        </Grid>
      ))}
    </Grid>
  );
};

export default SocialsAccordionContent;
