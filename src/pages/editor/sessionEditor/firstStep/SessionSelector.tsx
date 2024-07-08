import { Container } from "@mui/material";
import { IconedContainer } from "../../../../components/sessionContainer/IconedContainer";
import { Add, ArrowForward } from "@mui/icons-material";
import { SessionType } from "../../../../types/sessionType";
import { useTranslation } from "react-i18next";

type Props = {
  sessionTypes: SessionType[];
  onClick: (type: SessionType) => void;
  handleAddNew: () => void;
};

export const SessionSelector = ({
  sessionTypes,
  onClick,
  handleAddNew,
}: Props) => {
  const { t } = useTranslation();
  return (
    <Container sx={{ marginTop: 2, marginBottom: 2 }}>
      {sessionTypes.map((type, index) => (
        <IconedContainer
          key={index}
          text={type.name}
          style={{ marginBottom: 8 }}
          onClick={() => onClick(type)}
        >
          <ArrowForward color="secondary" fontSize="small" />
        </IconedContainer>
      ))}

      <IconedContainer
        style={{ marginTop: 32 }}
        text={t("editor.add_session")}
        onClick={handleAddNew}
      >
        <Add color="secondary" fontSize="small" />
      </IconedContainer>
    </Container>
  );
};
