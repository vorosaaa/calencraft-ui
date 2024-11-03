import {
  Container,
  TextField,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  Typography,
  Tooltip,
  Box,
} from "@mui/material";
import { BreakStateType } from "../../../../types/breakStateType";
import { NavigatorContainer } from "../../css/ProfileEditor.css";
import { useTranslation } from "react-i18next";
import { BreakType, RepeatType } from "../../../../types/enums";
import { Info } from "@mui/icons-material";
import { useEffect, useState } from "react";

type Props = {
  breakState: BreakStateType;
  handleNext: () => void;
  handleBack: () => void;
  handleChange: (
    key: keyof BreakStateType,
    value: string | number | BreakType | RepeatType | string[]
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
  const [openTooltip, setOpenTooltip] = useState<{
    regular: boolean;
    temporary: boolean;
  }>({ regular: false, temporary: false });

  const handleTooltipToggle = (tooltipType: "regular" | "temporary") => {
    setOpenTooltip((prev) => ({ ...prev, [tooltipType]: !prev[tooltipType] }));
  };

  const handleClickToogle = (tooltipType: "regular" | "temporary") => {
    setOpenTooltip((prev) => ({ ...prev, [tooltipType]: true }));
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (!(event.target as HTMLElement).closest(".info-icon")) {
      setOpenTooltip({ regular: false, temporary: false });
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleTypeChange = (
    _event: React.MouseEvent<HTMLElement>,
    newType: BreakType
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
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            width="100%"
            position="relative"
          >
            <Typography>{t("editor.break_regular")}</Typography>
            <Box position="absolute" right={0}>
              <Tooltip
                title={t("editor.break_regular_info")}
                arrow
                open={openTooltip.regular}
              >
                <Box
                  sx={{ display: "flex", justifyContent: "center" }}
                  className="info-icon-container"
                  onClick={() => handleClickToogle("regular")}
                  onMouseEnter={() => handleTooltipToggle("regular")}
                  onMouseLeave={() => handleTooltipToggle("regular")}
                >
                  <Info className="info-icon" color="info" />
                </Box>
              </Tooltip>
            </Box>
          </Box>
        </ToggleButton>
        <ToggleButton value={BreakType.TEMPORARY} aria-label="temp">
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            width="100%"
            position="relative"
          >
            <Typography>{t("editor.break_temporary")}</Typography>
            <Box position="absolute" right={0}>
              <Tooltip
                title={t("editor.break_temporary_info")}
                arrow
                open={openTooltip.temporary}
              >
                <Box
                  sx={{ display: "flex", justifyContent: "center" }}
                  className="info-icon-container"
                  onClick={() => handleClickToogle("temporary")}
                  onMouseEnter={() => handleTooltipToggle("temporary")}
                  onMouseLeave={() => handleTooltipToggle("temporary")}
                >
                  <Info className="info-icon" color="info" />
                </Box>
              </Tooltip>
            </Box>
          </Box>
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
