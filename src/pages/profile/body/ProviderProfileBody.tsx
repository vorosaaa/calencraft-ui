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
import { Typography } from "@mui/material";

type Props = {
  user: UserProfile;
};

export const ProviderProfileBody = ({ user }: Props) => {
  const { description, email, phone } = user;
  const isMobile = useCheckMobileScreen();
  const { t } = useTranslation();
  return (
    <BottomContainer
      sx={{
        flexDirection: isMobile ? "column" : "row",
        textAlign: isMobile ? "center" : "left",
      }}
    >
      <BottomLeftContainer>
        <SectionTitle variant="h6">{t("profile.aboutme")}</SectionTitle>
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
      </BottomLeftContainer>
      <BottomRightContainer>
        <BookingStepper provider={user} />
      </BottomRightContainer>
    </BottomContainer>
  );
};
