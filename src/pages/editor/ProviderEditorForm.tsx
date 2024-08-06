import {
  Button,
  Checkbox,
  Collapse,
  Container,
  Divider,
  FormControlLabel,
  Grid,
  SelectChangeEvent,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { EmailStatus } from "../../types/enums";
import { ChangeEvent, useEffect, useState } from "react";
import { AddressAccordionContent } from "./accordions/AddressAccordionContent";
import { ProviderPersonalContent } from "./accordions/ProviderPersonalContent";
import { EmailEditor } from "./emailEditor/EmailEditor";
import { SessionTypeEditorStepper } from "./sessionEditor/SessionEditorStepper";
import { useCheckMobileScreen } from "../../hooks/screenHook";
import { useTranslation } from "react-i18next";
import { BreakEditorStepper } from "./breakEditor/BreakEditorStepper";
import { FormState } from "../../types/formState";
import { useNavigate } from "react-router-dom";
import { FormFooter } from "./FormFooter";

type Props = {
  activeTab: number;
  formData: FormState;
  isDeleteLoading: boolean;
  handleDeleteOpen: () => void;
  setActiveTab: (newValue: number) => void;
  openVerificationModal: () => void;
  handleSubmit: () => void;
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (e: SelectChangeEvent<string>) => void;
};

export const ProviderEditorForm = (props: Props) => {
  const { formData, activeTab, setActiveTab } = props;
  const { t } = useTranslation();
  const isMobile = useCheckMobileScreen();

  const handleTabChange = (newValue: number) => {
    setActiveTab(newValue);
  };
  return (
    <Grid container sx={{ display: "flex", justifyContent: "center" }}>
      <Grid item xs={isMobile ? 12 : 2}>
        <Tabs
          orientation={isMobile ? "horizontal" : "vertical"}
          variant={isMobile ? "scrollable" : "standard"}
          sx={{
            mb: 2,
            borderRight: 1,
            borderColor: "divider",
          }}
          value={activeTab}
          onChange={(event, newValue) => handleTabChange(newValue)}
          indicatorColor="primary"
        >
          <Tab
            sx={{ alignItems: "flex-end" }}
            label={t("editor.personal_information")}
          />
          <Tab sx={{ alignItems: "flex-end" }} label={t("editor.sessions")} />
          <Tab sx={{ alignItems: "flex-end" }} label={t("editor.breaks")} />
          <Tab sx={{ alignItems: "flex-end" }} label={t("editor.email")} />
        </Tabs>
      </Grid>
      <Grid item xs={isMobile ? 12 : 7}>
        {activeTab === 0 && <FormEditor {...props} />}
        {activeTab === 1 && <SessionTypeEditorStepper formState={formData} />}
        {activeTab === 2 && <BreakEditorStepper />}
        {activeTab === 3 && <EmailEditor />}
      </Grid>
    </Grid>
  );
};

const FormEditor = ({
  formData,
  isDeleteLoading,
  handleDeleteOpen,
  openVerificationModal,
  handleInputChange,
  handleSelectChange,
  handleSubmit,
}: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    subscriptionType,
    name,
    description,
    address,
    billingAddress,
    serviceCategory,
    phoneNumber,
    emailStatus,
  } = formData;
  const [isBillingAddressDifferent, setIsBillingAddressDifferent] =
    useState(false);

  // Effect to set the default state of the checkbox
  useEffect(() => {
    if (
      billingAddress &&
      JSON.stringify(address) !== JSON.stringify(billingAddress)
    ) {
      setIsBillingAddressDifferent(true);
    }
  }, [address, billingAddress]);

  // Handle checkbox change
  const handleCheckboxChange = (event: any) => {
    const isChecked = event.target.checked;
    setIsBillingAddressDifferent(isChecked);
    if (!isChecked) {
      handleInputChange({
        ...event,
        target: { name: "billingAddress", value: billingAddress || address },
      });
    }
  };

  return (
    <Container>
      {subscriptionType && subscriptionType === "NO_SUBSCRIPTION" && (
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
      <ProviderPersonalContent
        name={name}
        phoneNumber={phoneNumber}
        description={description}
        serviceCategory={serviceCategory}
        handleInputChange={handleInputChange}
        handleSelectChange={handleSelectChange}
      />
      {address && (
        <Divider variant="middle" sx={{ mb: 4, mt: 4 }}>
          <Typography variant="body2">{t("editor.address")}</Typography>
        </Divider>
      )}
      {address && (
        <AddressAccordionContent
          name="address"
          address={address}
          handleInputChange={handleInputChange}
        />
      )}
      <FormControlLabel
        sx={{ mt: 2 }}
        control={
          <Checkbox
            checked={isBillingAddressDifferent}
            onChange={handleCheckboxChange}
            name="billingAddressCheckbox"
            color="primary"
          />
        }
        label={t("editor.billing_address_info")}
      />
      <Collapse in={isBillingAddressDifferent}>
        {address && (
          <AddressAccordionContent
            name="billingAddress"
            address={billingAddress}
            handleInputChange={handleInputChange}
          />
        )}
      </Collapse>
      <FormFooter
        isDeleteLoading={isDeleteLoading}
        handleSubmit={handleSubmit}
        handleDeleteOpen={handleDeleteOpen}
      />
    </Container>
  );
};
