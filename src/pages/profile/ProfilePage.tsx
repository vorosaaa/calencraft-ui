import { Container } from "./css/ProfileHeader.css";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { ProfileHeader } from "./ProfileHeader";
import { ProviderProfileBody } from "./body/ProviderProfileBody";
import { UserProfileBody } from "./body/UserProfileBody";
import { getUser } from "../../api/userApi";
import { SubscriptionType } from "../../types/enums";
import { Skeleton } from "@mui/material";
import { config } from "../../config/config";

export const ProfilePage: React.FC = () => {
  const { identifier } = useParams();

  const { data, isLoading } = useQuery("user", () =>
    getUser(identifier as string),
  );

  if (!data || isLoading) return <LoadingView />;

  return (
    <Container>
      <ProfileHeader user={data} />
      {data.isProvider &&
      (config.MODE !== "production" ||
        data.subscription !== SubscriptionType.NO_SUBSCRIPTION) ? (
        <ProviderProfileBody user={data} />
      ) : (
        <UserProfileBody user={data} />
      )}
    </Container>
  );
};

const LoadingView = () => {
  return (
    <Container>
      <Skeleton variant="rectangular" width="100%" height="50vh" />
      <Skeleton
        variant="circular"
        width={120}
        height={120}
        sx={{
          bgcolor: "grey.400",
          position: "relative",
          top: "-24vh",
          left: "calc(50% - 60px)",
        }}
      />
    </Container>
  );
};
