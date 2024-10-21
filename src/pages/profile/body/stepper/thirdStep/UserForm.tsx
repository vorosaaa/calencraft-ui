import { useTranslation } from "react-i18next";
import { FormField } from "./css/UserForm.css";
import { NavigatorContainer } from "../css/BookingStepper.css";
import { Button, Container } from "@mui/material";
import { UserState } from "../../../../../types/userState";

type Props = {
  userState: UserState;
  handleBack: () => void;
  handleNext: () => void;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
};

export const UserForm = ({
  userState,
  handleChange,
  handleBack,
  handleNext,
}: Props) => {
  const { t } = useTranslation();
  return (
    <Container sx={{ mt: 2 }}>
      <form>
        <FormField
          label={t("profile.thirdStep.name")}
          variant="outlined"
          fullWidth
          name="name"
          value={userState.name}
          onChange={handleChange}
          required
        />
        <FormField
          label={t("profile.thirdStep.email")}
          variant="outlined"
          fullWidth
          name="email"
          type="email"
          value={userState.email}
          onChange={handleChange}
          required
        />
        <FormField
          label={t("profile.thirdStep.phone")}
          variant="outlined"
          fullWidth
          name="phoneNumber"
          type="tel"
          value={userState.phoneNumber}
          required
          onChange={handleChange}
        />
      </form>
      <NavigatorContainer>
        <Button variant="outlined" onClick={handleBack}>
          {t("profile.back")}
        </Button>
        <Button
          disabled={!userState.name || !validateEmail(userState.email)}
          variant="outlined"
          onClick={handleNext}
        >
          {t("profile.next")}
        </Button>
      </NavigatorContainer>
    </Container>
  );
};

const validateEmail = (email: string) => {
  return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    email,
  );
};
