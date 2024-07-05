import {
  Container,
  TextField,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  Typography,
} from "@mui/material";
import { BreakStateType } from "../../../../types/breakStateType";
import { NavigatorContainer } from "../../css/ProfileEditor.css";
import { useTranslation } from "react-i18next";
import { BreakType, RepeatType } from "../../../../types/enums";

type Props = {
  breakState: BreakStateType;
  handleNext: () => void;
  handleBack: () => void;
  handleChange: (
    key: keyof BreakStateType,
    value: string | number | BreakType | RepeatType | string[],
  ) => void;
};

export const BreakForm = ({
  breakState,
  handleChange,
  handleBack,
  handleNext,
}: Props) => {
  const { t } = useTranslation();
  const { name, type } = breakState;

  const handleTypeChange = (
    event: React.MouseEvent<HTMLElement>,
    newType: BreakType,
  ) => handleChange("type", newType);

  return (
    <Container>
      <TextField
        label={t("editor.name")}
        variant="outlined"
        fullWidth
        value={name}
        onChange={(e) => handleChange("name", e.target.value)}
        sx={{ my: 2 }}
      />
      <ToggleButtonGroup
        size="small"
        value={type}
        fullWidth
        exclusive
        onChange={handleTypeChange}
        aria-label="break type"
        sx={{ mb: 2 }}
      >
        <ToggleButton value={BreakType.REGULAR} aria-label="regular">
          <Typography>{t("editor.break_regular")}</Typography>
        </ToggleButton>
        <ToggleButton value={BreakType.TEMPORARY} aria-label="temp">
          <Typography>{t("editor.break_temporary")}</Typography>
        </ToggleButton>
      </ToggleButtonGroup>

      <NavigatorContainer>
        <Button
          variant="outlined"
          color="primary"
          onClick={handleBack}
          sx={{ marginBottom: 2 }}
        >
          {t("editor.back")}
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleNext}
          sx={{ marginBottom: 2 }}
        >
          {t("editor.next")}
        </Button>
      </NavigatorContainer>
    </Container>
  );
};
