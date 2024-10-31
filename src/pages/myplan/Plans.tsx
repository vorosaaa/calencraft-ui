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
import { Check, Close } from "@mui/icons-material";
import { colors } from "../../theme/colors";

type Props = {
  handleNext: (type: SubscriptionType) => void;
};

export const Plans = ({ handleNext }: Props) => {
  const { data: meData } = useMe();
  const { t } = useTranslation();
  const planDetails = [
    {
      type: SubscriptionType.NO_SUBSCRIPTION,
      color: colors.subscriptionOrange,
      title: t("subscriptions.free.title"),
      price: t("subscriptions.free.price"),
      advantages: [
        t("subscriptions.free.features.trial"),
        t("subscriptions.free.features.not_available"),
      ],
    },
    {
      type: SubscriptionType.STANDARD,
      color: colors.subscriptionGreen,
      title: t("subscriptions.standard.title"),
      price: t("subscriptions.standard.price"),
      advantages: [
        t("subscriptions.standard.features.automatic_email_handling"),
        t("subscriptions.standard.features.available"),
        t("subscriptions.standard.features.calendar"),
      ],
    },
    {
      type: SubscriptionType.PROFESSIONAL,
      color: colors.subscriptionPurple,
      title: t("subscriptions.premium.title"),
      price: t("subscriptions.premium.price"),
      advantages: [],
    },
  ];

  const hasTheSamePlan = (type: SubscriptionType) =>
    meData?.user?.subscriptionType === type;

  const isTrialActive = () =>
    meData?.user?.subscriptionType === SubscriptionType.TRIAL;

  const onPlanClick = (type: SubscriptionType) => {
    if (hasTheSamePlan(type)) return;
    handleNext(type);
  };
  return (
    <Container disableGutters>
      <Typography variant="h4" align="center" gutterBottom sx={{ mt: 2 }}>
        {t("subscriptions.title")}
      </Typography>
      {isTrialActive() && (
        <Container
          disableGutters
          sx={{
            backgroundColor: colors.subscriptionGreen,
            display: "flex",
            padding: 1,
            borderRadius: 2,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Check sx={{ mr: 1 }} fontSize="small" color="inherit" />
          <Typography variant="body1">{t("subscriptions.trial")}</Typography>
        </Container>
      )}

      <Grid container spacing={2} sx={{ mt: isTrialActive() ? 2 : 4 }}>
        {planDetails.map((plan, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Paper
              key={index}
              elevation={8}
              sx={{
                textAlign: "center",
                borderRadius: 2,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                opacity: isPlanProfessional(plan.type) ? 0.35 : 1,
                height: "100%",
                paddingBottom: 2,
              }}
            >
              <Container disableGutters>
                <Container
                  sx={{
                    backgroundColor: plan.color,
                    borderRadius: 2,
                    padding: 2,
                  }}
                >
                  <Typography variant="h6">{plan.title}</Typography>
                  <Typography sx={{ fontWeight: "bold" }} variant="h5">
                    {plan.price}
                  </Typography>
                </Container>
                <List sx={{ marginRight: 2, marginLeft: 2, marginTop: 1 }}>
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
