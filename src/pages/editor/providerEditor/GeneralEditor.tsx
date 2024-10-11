import { ChangeEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FormState } from "../../../types/formState";
import {
  Checkbox,
  Collapse,
  Container,
  Divider,
  FormControlLabel,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { VerificationMode } from "../../../types/enums";
import { AddressAccordionContent } from "../accordions/AddressAccordionContent";
import { FormFooter } from "../FormFooter";
import { ProviderPersonalContent } from "../accordions/ProviderPersonalContent";
import { useVerificationModalHook } from "../../../hooks/verificationHook";
import { useDeleteMutation } from "../../../mutations/mutations";
import { ProfileEditorHeader } from "../ProfileEditorHeader";
import { Warning } from "./Warning";
import { DeleteModal } from "../modal/DeleteModal";
import { Pictures } from "../../../types/pictures";
import { useNavigate } from "react-router-dom";

type Props = {
  formData: FormState;
  pictureData: Pictures;
  setFormData: (value: React.SetStateAction<FormState | undefined>) => void;
  handleSubmit: () => void;
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (e: SelectChangeEvent<string>) => void;
  handlePictureChange: (
    key: keyof Pictures,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
};

export const GeneralEditor = ({
  formData,
  pictureData,
  setFormData,
  handleInputChange,
  handleSelectChange,
  handleSubmit,
  handlePictureChange,
}: Props) => {
  const { t } = useTranslation();
  const { setVerification } = useVerificationModalHook();
  const navigate = useNavigate();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isBillingAddressDifferent, setIsBillingAddressDifferent] =
    useState(false);
  const {
    subscriptionType,
    name,
    slug,
    description,
    address,
    billingAddress,
    serviceCategory,
    phoneNumber,
    emailStatus,
  } = formData;

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
    setIsBillingAddressDifferent(event.target.checked);
  };

  const { mutate, isLoading: isDeleteLoading } = useDeleteMutation();

  const navigateToVerification = () => {
    setVerification(
      VerificationMode.VERIFICATION,
      VerificationMode.VERIFICATION,
    );
    navigate("/verification");
  };

  const handleDelete = () => {
    mutate();
    setDeleteOpen(false);
  };

  const setCoverPosition = (position: string) => {
    if (!formData) return;
    setFormData({ ...formData, coverPosition: position });
  };

  return (
    <Container disableGutters>
      <DeleteModal
        open={deleteOpen}
        handleClose={() => setDeleteOpen(false)}
        handleDelete={handleDelete}
      />
      <ProfileEditorHeader
        pictures={pictureData}
        coverPosition={formData.coverPosition}
        setCoverPosition={setCoverPosition}
        handlePictureChange={handlePictureChange}
      />
      <Container>
        <Warning
          subscriptionType={subscriptionType}
          emailStatus={emailStatus}
          openVerificationModal={navigateToVerification}
        />
        <ProviderPersonalContent
          name={name}
          slug={slug}
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
          sx={{ mt: 2, mb: 2 }}
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
          handleDeleteOpen={() => setDeleteOpen(true)}
        />
      </Container>
    </Container>
  );
};
