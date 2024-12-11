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
import SocialsAccordionContent from "../accordions/SocialsAccordionContent";
import { useFormContext } from "react-hook-form";
import { Address } from "../../../types/user";
import { useMe } from "../../../queries/queries";

type Props = {
  pictureData: Pictures;
  onSubmit: () => void;
  handlePictureChange: (
    key: keyof Pictures,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
};

export const UserEditor = ({
  pictureData,
  handlePictureChange,
  onSubmit,
}: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { watch } = useFormContext<Partial<FormState>>();

  const { data } = useMe();
  if (!data) return null;

  const [deleteOpen, setDeleteOpen] = useState(false);
  const { setVerification } = useVerificationModalHook();

  const { emailStatus } = data.user;
  const address = watch("address") as Address;

  const { mutate, isPending: isDeleteLoading } = useDeleteMutation();

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

  return (
    <Container disableGutters sx={{ marginBottom: 6, width: "100%" }}>
      <DeleteModal
        open={deleteOpen}
        handleClose={() => setDeleteOpen(false)}
        handleDelete={handleDelete}
      />
      <ProfileEditorHeader
        pictures={pictureData}
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
        <UserPersonalContent />
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
        <FormFooter
          isDeleteLoading={isDeleteLoading}
          onSubmit={onSubmit}
          handleDeleteOpen={() => setDeleteOpen(true)}
        />
      </Container>
    </Container>
  );
};
