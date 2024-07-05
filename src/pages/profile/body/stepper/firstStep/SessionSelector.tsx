import { Container } from "@mui/material";
import { SessionType } from "../../../../../types/SessionType";
import { ArrowForward } from "@mui/icons-material";
import { SessionContainer } from "../../../../editor/sessionEditor/firstStep/SessionContainer";

type Props = {
  sessionTypes?: SessionType[];
  onClick: (type: SessionType) => void;
};

export const SessionSelector = ({ sessionTypes, onClick }: Props) => {
  return (
    <Container sx={{ mt: 2, mb: 2 }}>
      {sessionTypes?.map((type, index) => (
        <SessionContainer
          key={index}
          session={type}
          style={{ marginBottom: 8 }}
          onClick={() => onClick(type)}
        >
          <ArrowForward color="secondary" fontSize="small" />
        </SessionContainer>
      ))}
    </Container>
  );
};
