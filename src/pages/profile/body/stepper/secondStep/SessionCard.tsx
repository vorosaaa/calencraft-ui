import { ExpandMore } from "@mui/icons-material";
import {
  Card,
  CardContent,
  CardHeader,
  Collapse,
  IconButton,
  Typography,
  styled,
} from "@mui/material";
import { useState } from "react";
import { SessionType } from "../../../../../types/SessionType";
import { useTranslation } from "react-i18next";

interface SessionCardProps {
  session: SessionType;
}

const ExpandIcon = styled((props: { expand: boolean }) => {
  const { expand, ...other } = props;
  return <ExpandMore {...other} />;
})(({ theme, expand }) => ({
  transform: expand ? "rotate(180deg)" : "rotate(0deg)",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

export const SessionCard = ({ session }: SessionCardProps) => {
  const { name, price, currency, description, lengthInMinutes } = session;
  const [expanded, setExpanded] = useState(false);
  const { t } = useTranslation();

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card elevation={2} sx={{ mb: 2 }}>
      <CardHeader
        action={
          <IconButton
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandIcon expand={expanded} />
          </IconButton>
        }
        title={name}
      />
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography>{description}</Typography>
          <Typography>
            {t("profile.secondStep.price", { price, currency })}
          </Typography>
          <Typography>
            {t("profile.secondStep.length", { minutes: lengthInMinutes })}
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
};
