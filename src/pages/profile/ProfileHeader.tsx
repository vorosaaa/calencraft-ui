import { UserProfile } from "../../types/user";
import {
  ContainerOnOverlay,
  Name,
  Overlay,
  ProfilePic,
  StyledPaper,
  TextContainer,
} from "./css/ProfileHeader.css";

type Props = {
  user: UserProfile;
};

export const ProfileHeader = ({ user }: Props) => {
  const { name, picUrl, coverUrl, coverPosition } = user;

  return (
    <StyledPaper
      elevation={3}
      sx={{
        backgroundImage: `url("${coverUrl}")`,
        backgroundPosition: coverPosition,
      }}
    >
      <Overlay />
      <ContainerOnOverlay>
        <ProfilePic alt={name} src={picUrl} />
        {/* Content for the top section */}
        <TextContainer>
          <Name variant="h4">{name}</Name>
        </TextContainer>
      </ContainerOnOverlay>
    </StyledPaper>
  );
};
