import { Container } from "@mui/material";
import { IconedContainer } from "../../../../components/sessionContainer/IconedContainer";
import { Add, ArrowForward } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { BreakStateType } from "../../../../types/breakStateType";

type Props = {
  breaks: BreakStateType[];
  onClick: (type: BreakStateType) => void;
  handleAddNew: () => void;
};

export const BreakSelector = ({ breaks, onClick, handleAddNew }: Props) => {
  const { t } = useTranslation();
  return (
    <Container sx={{ marginTop: 2, marginBottom: 2 }}>
      {breaks.map((br, index) => (
        <IconedContainer
          key={index}
          text={br.name}
          style={{ marginBottom: 8 }}
          onClick={() => onClick(br)}
        >
          <ArrowForward color="secondary" fontSize="small" />
        </IconedContainer>
      ))}

      <IconedContainer
        style={{ marginTop: 32 }}
        text={t("editor.add_break")}
        onClick={handleAddNew}
      >
        <Add color="secondary" fontSize="small" />
      </IconedContainer>
    </Container>
  );
};
