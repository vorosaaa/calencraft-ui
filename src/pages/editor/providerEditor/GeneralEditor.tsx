import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Checkbox,
  Collapse,
  Container,
  Divider,
  FormControlLabel,
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
import SocialsAccordionContent from "../accordions/SocialsAccordionContent";
import { Address } from "../../../types/user";
import { useFormContext } from "react-hook-form";
import { FormState } from "../../../types/formState";

type Props = {
  pictureData: Pictures;
  onSubmit: any;
  handlePictureChange: (
    key: keyof Pictures,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
};

export const GeneralEditor = ({
  pictureData,
  handlePictureChange,
  onSubmit,
}: Props) => {
  const { t } = useTranslation();
  const { setVerification } = useVerificationModalHook();
  const navigate = useNavigate();
  const { watch } = useFormContext<Partial<FormState>>();

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isBillingAddressDifferent, setIsBillingAddressDifferent] =
    useState(false);

  const address = watch("address") as Address;
  const billingAddress = watch("billingAddress") as Address;

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

  const { mutate, isPending: isDeleteLoading } = useDeleteMutation();

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
  return (
    <Container disableGutters sx={{ marginBottom: 6 }}>
      <DeleteModal
        open={deleteOpen}
        handleClose={() => setDeleteOpen(false)}
        handleDelete={handleDelete}
      />
      <ProfileEditorHeader
        pictures={pictureData}
        handlePictureChange={handlePictureChange}
      />
      <Container>
        <Warning openVerificationModal={navigateToVerification} />
        <ProviderPersonalContent />
        <Divider variant="middle" sx={{ mb: 4, mt: 4 }}>
          <Typography variant="h6">{t("editor.socials")}</Typography>
        </Divider>
        <SocialsAccordionContent />
        {address && (
          <Divider variant="middle" sx={{ mb: 4, mt: 4 }}>
            <Typography variant="h6">{t("editor.address")}</Typography>
          </Divider>
        )}
        {address && (
          <AddressAccordionContent name="address" address={address} />
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
            />
          )}
        </Collapse>
        <FormFooter
          isDeleteLoading={isDeleteLoading}
          onSubmit={onSubmit}
          handleDeleteOpen={() => setDeleteOpen(true)}
        />
      </Container>
    </Container>
  );
};
