import React, { useState } from "react";
import { Button, Container, Divider, Typography } from "@mui/material";
import { EmailStatus, VerificationMode } from "../../../types/enums";
import { AddressAccordionContent } from "../accordions/AddressAccordionContent";
import { UserPersonalContent } from "../accordions/UserPersonalContent";
import { FormState } from "../../../types/formState";
import { useTranslation } from "react-i18next";
import { FormFooter } from "../FormFooter";
import { useDeleteMutation } from "../../../mutations/mutations";
import { DeleteModal } from "../modal/DeleteModal";
import { Pictures } from "../../../types/pictures";
import { ProfileEditorHeader } from "../ProfileEditorHeader";
import { useNavigate } from "react-router-dom";
import { useVerificationModalHook } from "../../../hooks/verificationHook";

type Props = {
  formData: FormState;
  pictureData: Pictures;
  setFormData: (value: React.SetStateAction<FormState | undefined>) => void;
  handleSubmit: () => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePictureChange: (
    key: keyof Pictures,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
};

export const UserEditor = ({
  formData,
  pictureData,
  setFormData,
  handlePictureChange,
  handleSubmit,
  handleInputChange,
}: Props) => {
  const { t } = useTranslation();
  const { name, emailStatus, phoneNumber, description, address } = formData;
  const [deleteOpen, setDeleteOpen] = useState(false);
  const navigate = useNavigate();
  const { setVerification } = useVerificationModalHook();

  const { mutate, isLoading: isDeleteLoading } = useDeleteMutation();

  const handleDelete = () => {
    mutate();
    setDeleteOpen(false);
  };

  const navigateToVerification = () => {
    setVerification(
      VerificationMode.VERIFICATION,
      VerificationMode.VERIFICATION,
    );
    navigate("/verification");
  };

  const setCoverPosition = (position: string) => {
    if (!formData) return;
    setFormData({ ...formData, coverPosition: position });
  };

  return (
    <Container disableGutters sx={{ marginBottom: 2, width: "100%" }}>
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
      <Container maxWidth="md">
        {emailStatus === EmailStatus.NOT_CONFIRMED && (
          <Button
            sx={{ mb: 2 }}
            fullWidth
            variant="outlined"
            color="warning"
            onClick={navigateToVerification}
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
          handleDeleteOpen={() => setDeleteOpen(true)}
        />
      </Container>
    </Container>
  );
};
