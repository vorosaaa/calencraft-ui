import React from "react";
import { Button, Container, Divider, Typography } from "@mui/material";
import { EmailStatus } from "../../types/enums";
import { AddressAccordionContent } from "./accordions/AddressAccordionContent";
import { UserPersonalContent } from "./accordions/UserPersonalContent";
import { FormState } from "../../types/formState";
import { useTranslation } from "react-i18next";
import { FormFooter } from "./FormFooter";

type Props = {
  formData: FormState;
  isDeleteLoading: boolean;
  openVerificationModal: () => void;
  handleSubmit: () => void;
  handleDeleteOpen: () => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const UserEditorForm = ({
  formData,
  isDeleteLoading,
  openVerificationModal,
  handleSubmit,
  handleDeleteOpen,
  handleInputChange,
}: Props) => {
  const { t } = useTranslation();
  const { name, emailStatus, phoneNumber, description, address } = formData;

  return (
    <Container maxWidth="sm" sx={{ marginBottom: 2 }}>
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
      <UserPersonalContent
        name={name}
        phoneNumber={phoneNumber}
        description={description}
        handleInputChange={handleInputChange}
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
      <FormFooter
        isDeleteLoading={isDeleteLoading}
        handleSubmit={handleSubmit}
        handleDeleteOpen={handleDeleteOpen}
      />
    </Container>
  );
};
