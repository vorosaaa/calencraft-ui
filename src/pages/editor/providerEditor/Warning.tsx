import { Fragment } from "react/jsx-runtime";
import { EmailStatus, SubscriptionType } from "../../../types/enums";
import { Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

type Props = {
  subscriptionType?: SubscriptionType;
  emailStatus: EmailStatus;
  openVerificationModal: () => void;
};

export const Warning = ({
  subscriptionType,
  emailStatus,
  openVerificationModal,
}: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
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
