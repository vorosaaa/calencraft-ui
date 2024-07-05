// MyPlanPage.tsx
import {
  Typography,
  Paper,
  Button,
  Container,
  List,
  ListItem,
  Grid,
  ListItemIcon,
} from "@mui/material";
import { SubscriptionType } from "../../types/enums";
import { useMe } from "../../queries/queries";
import { useTranslation } from "react-i18next";
import { AutoMode, Check, Close } from "@mui/icons-material";
import { config } from "../../config/config";

type Props = {
  handleNext: (type: SubscriptionType) => void;
};

export const Plans = ({ handleNext }: Props) => {
  const { data: meData } = useMe();
  const { t } = useTranslation();
  const planDetails = [
    {
      type: SubscriptionType.NO_SUBSCRIPTION,
      title: t("subscriptions.free.title"),
      advantages: [
        t("subscriptions.free.features.trial"),
        t("subscriptions.free.features.not_available"),
      ],
    },
    {
      type: SubscriptionType.STANDARD,
      title: t("subscriptions.standard.title"),
      price: t("subscriptions.standard.price"),
      advantages: [
        t("subscriptions.standard.features.trial"),
        t("subscriptions.standard.features.automatic_email_handling"),
        t("subscriptions.standard.features.available"),
      ],
    },
    {
      type: SubscriptionType.PROFESSIONAL,
      title: t("subscriptions.premium.title"),
      price: t("subscriptions.premium.price"),
      advantages: [],
    },
  ];

  const hasTheSamePlan = (type: SubscriptionType) =>
    meData?.user?.subscriptionType === type;

  const onPlanClick = (type: SubscriptionType) => {
    if (hasTheSamePlan(type)) return;
    handleNext(type);
  };
  return config.MODE === "development" || config.MODE === "test" ? (
    <DevelopmentPage />
  ) : (
    <Container disableGutters>
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{ mt: 2, mb: 4 }}
      >
        {t("subscriptions.title")}
      </Typography>

      <Grid container spacing={2}>
        {planDetails.map((plan, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Paper
              key={index}
              elevation={8}
              sx={{
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: 3,
                opacity: isPlanProfessional(plan.type) ? 0.35 : 1,
                height: "100%",
              }}
            >
              <Container disableGutters>
                <Typography variant="h6" gutterBottom>
                  {plan.title}
                </Typography>
                <Typography
                  sx={{ fontWeight: "bold" }}
                  variant="h5"
                  gutterBottom
                >
                  {plan.price}
                </Typography>
                <List sx={{ mt: plan.price ? 0 : 6 }}>
                  {plan.advantages.map((advantage, i) => (
                    <ListItem divider key={advantage + i} sx={{ paddingX: 0 }}>
                      <ListItemIcon>
                        {i === 1 &&
                        plan.type === SubscriptionType.NO_SUBSCRIPTION ? (
                          <Close color="error" />
                        ) : (
                          <Check color="success" />
                        )}
                      </ListItemIcon>
                      <Typography variant="body1">{advantage}</Typography>
                    </ListItem>
                  ))}
                </List>
              </Container>
              <Button
                variant="contained"
                color={hasTheSamePlan(plan.type) ? "success" : "primary"}
                onClick={() => onPlanClick(plan.type)}
                startIcon={hasTheSamePlan(plan.type) ? <Check /> : null}
                sx={{
                  marginTop: 2,
                  alignSelf: "center",
                  cursor: hasTheSamePlan(plan.type) ? "default" : "pointer",
                  pointerEvents:
                    isPlanProfessional(plan.type) || hasTheSamePlan(plan.type)
                      ? "none"
                      : "initial",
                }}
              >
                {hasTheSamePlan(plan.type)
                  ? t("subscriptions.active")
                  : t("subscriptions.select")}
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

const isPlanProfessional = (type: SubscriptionType) =>
  type === SubscriptionType.PROFESSIONAL;

const DevelopmentPage = () => {
  const { t } = useTranslation();
  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 2 }}>
        <Typography sx={{ textAlign: "center" }} variant="h5" gutterBottom>
          {t("development.title")}{" "}
          <AutoMode color="success" style={{ verticalAlign: "middle" }} />
        </Typography>
        <Typography sx={{ mt: 4 }} variant="body1">
          {t("development.description")}
        </Typography>
        <Typography sx={{ mt: 2 }} variant="body1">
          {t("development.suggestion")}
        </Typography>
        <Typography variant="body1">
          <a
            href="mailto:hello@calencraft.com"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            hello@calencraft.com
          </a>
        </Typography>
      </Paper>
    </Container>
  );
};
