import { Description, SectionTitle } from "../css/ProfileHeader.css";

import { BottomContainer, CertificationList } from "./css/ProviderBody.css";
import { UserProfile } from "../../../types/user";
import { useTranslation } from "react-i18next";

type Props = {
  user: UserProfile;
};

export const UserProfileBody = ({ user }: Props) => {
  const { t } = useTranslation();
  const { description, goals, email, phone } = user;
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
      {goals?.length !== 0 && <SectionTitle variant="h6">Goals</SectionTitle>}
      <CertificationList>
        {goals?.map((goal, index) => <li key={index}>{goal}</li>)}
      </CertificationList>
    </BottomContainer>
  );
};
