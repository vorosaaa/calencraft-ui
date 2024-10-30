import { Fragment } from "react/jsx-runtime";
import { EmailStatus, SubscriptionType } from "../../../types/enums";
import { Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useMe } from "../../../queries/queries";
import { useMemo } from "react";

type Props = {
  openVerificationModal: () => void;
};

export const Warning = ({ openVerificationModal }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data } = useMe();
  if (!data) return null;

  const { subscriptionType, emailStatus, createdAt } = data.user;
  const reaminingDays = useMemo(() => {
    const currentDate = new Date();
    const createdDate = new Date(createdAt);
    const differenceInTime = currentDate.getTime() - createdDate.getTime();
    return Math.floor(differenceInTime / (1000 * 3600 * 24));
  }, [data]);

  return (
    <Fragment>
      {subscriptionType &&
        subscriptionType === SubscriptionType.NO_SUBSCRIPTION && (
          <Button
            sx={{ mb: 2 }}
            fullWidth
            variant="outlined"
            color="warning"
            onClick={() => navigate("/myplan")}
          >
            {t("editor.no_plan")}
          </Button>
        )}
      {subscriptionType && subscriptionType === SubscriptionType.TRIAL && (
        <Button
          sx={{ mb: 2 }}
          fullWidth
          variant="contained"
          color="success"
          onClick={() => navigate("/myplan")}
        >
          {t("editor.trial", { days: 14 - reaminingDays })}
        </Button>
      )}
      {emailStatus === EmailStatus.NOT_CONFIRMED && (
        <Button
          sx={{ mb: 2 }}
          fullWidth
          variant="outlined"
          color="warning"
          onClick={openVerificationModal}
        >
          {t("editor.verify_email")}
        </Button>
      )}
    </Fragment>
  );
};
