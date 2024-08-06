import React, { Fragment, useEffect, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { ProviderEditorForm } from "./ProviderEditorForm";
import { LoadingHeader, ProfileEditorHeader } from "./ProfileEditorHeader";
import {
  deleteUser,
  updateProfile,
  uploadCoverPicture,
  uploadProfilePicture,
} from "../../api/meApi";
import { UserEditorForm } from "./UserEditorForm";
import {
  Container,
  Grid,
  Skeleton,
  SelectChangeEvent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import { useVerificationModalHook } from "../../hooks/verificationHook";
import { EmailStatus, VerificationMode } from "../../types/enums";
import { useNavigate } from "react-router-dom";
import { enqueueError, enqueueSuccess } from "../../enqueueHelper";
import { useMe } from "../../queries/queries";
import { FormState } from "../../types/formState";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../hooks/authHook";

const initialData: FormState = {
  emailStatus: EmailStatus.CONFIRMED,
  isProvider: false,
  coverPosition: "50% 50%",
  name: "",
  phoneNumber: "",
  serviceCategory: "",
  description: "",
  coverUrl: "",
  address: undefined,
};

export const ProfileEditor = () => {
  const { t } = useTranslation();
  const { removeAuth } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { setVerification } = useVerificationModalHook();

  const [formData, setFormData] = useState<FormState | undefined>();
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [cover, setCover] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [deleteOpen, setDeleteOpen] = useState(false);

  //Queries
  const { data: meData, isLoading: meDataLoading } = useMe({
    onError: () => navigate("/"),
  });

  //Mutations
  const { mutate: updateMe } = useMutation(updateProfile, {
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      data.success
        ? enqueueSuccess(t(`messages.success.${data.message}`))
        : enqueueError(t(`messages.errors.${data.message}`));
    },
    onError: (error: any) =>
      enqueueError(t(`messages.errors.${error.response.data.message}`)),
  });

  const { mutate: updateProfilePicture } = useMutation(uploadProfilePicture, {
    onError: (error: any) =>
      enqueueError(t(`messages.errors.${error.response.data.message}`)),
  });

  const { mutate: updateCoverPicture } = useMutation(uploadCoverPicture, {
    onError: (error: any) =>
      enqueueError(t(`messages.errors.${error.response.data.message}`)),
  });

  const { mutate: removeAccount, isLoading: isDeleteLoading } = useMutation(
    deleteUser,
    {
      onSuccess: (data: any) => {
        removeAuth();
        queryClient.invalidateQueries({ queryKey: ["me"] });
        enqueueSuccess(t(`messages.success.${data.message}`));
        navigate("/");
      },
      onError: (error: any) =>
        enqueueError(t(`messages.errors.${error.response.data.message}`)),
    },
  );

  //Handlers and functions
  const openVerificationModal = () => {
    setVerification(
      true,
      VerificationMode.VERIFICATION,
      VerificationMode.VERIFICATION,
    );
  };
  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    if (!formData) {
      setFormData({ ...initialData, [name]: value });
      return;
    }
    setFormData({ ...formData, [name]: value });
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const data = formData ? formData : initialData;
    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1];

      setFormData({
        ...data,
        address: {
          ...data?.address,
          [addressField]: value,
        },
      });
    } else if (name.startsWith("billingAddress.")) {
      const addressField = name.split(".")[1];

      setFormData({
        ...data,
        billingAddress: {
          ...data?.billingAddress,
          [addressField]: value,
        },
      });
    } else {
      setFormData({
        ...data,
        [name]: value,
      });
    }
  };

  const setCoverPosition = (position: string) => {
    if (!formData) return;
    setFormData({ ...formData, coverPosition: position });
  };

  const handleProfilePictureChange = ({
    target: { files },
  }: React.ChangeEvent<HTMLInputElement>) =>
    setProfilePicture(files?.[0] || null);

  const handleCoverChange = ({
    target: { files },
  }: React.ChangeEvent<HTMLInputElement>) => setCover(files?.[0] || null);

  // Handle form submission logic
  const handleSubmit = () => {
    // Create a FormData object to send the file and other data
    if (!formData) return;
    const form = new FormData();
    form.append("name", formData.name);
    form.append("phoneNumber", formData.phoneNumber);
    form.append("address", JSON.stringify(formData.address));
    form.append("coverPosition", formData.coverPosition);
    if (formData.isProvider) {
      form.append("billingAddress", JSON.stringify(formData.billingAddress));
      form.append("description", formData.description);
      form.append("serviceCategory", formData.serviceCategory);
    }
    if (profilePicture) {
      const profilePicForm = new FormData();
      profilePicForm.append("picture", profilePicture);
      updateProfilePicture(profilePicForm); // Update the profile picture
    }
    if (cover) {
      const coverForm = new FormData();
      coverForm.append("cover", cover);
      updateCoverPicture(coverForm); // Update the cover picture
    }
    updateMe(form);
  };

  const handleDelete = () => {
    removeAccount();
    setDeleteOpen(false);
  };

  useEffect(() => {
    if (meData) {
      setFormData({
        subscriptionType: meData.user.subscription,
        emailStatus: meData.user.emailStatus,
        isProvider: meData.user.isProvider,
        coverPosition: meData.user.coverPosition,
        name: meData.user.name,
        phoneNumber: meData.user.phoneNumber,
        serviceCategory: meData.user.serviceCategory,
        description: meData.user.description,
        coverUrl: meData.user.coverUrl,
        address: meData.user.address,
        billingAddress: meData.user.billingAddress,
      });
    }
  }, [meData]);

  if (!meData || meDataLoading || !formData) return <LoadingView />;
  return (
    <Fragment>
      <DeleteModal
        open={deleteOpen}
        handleClose={() => setDeleteOpen(false)}
        handleDelete={handleDelete}
      />
      <ProfileEditorHeader
        activeTab={activeTab}
        coverPicture={cover}
        profilePicture={profilePicture}
        coverPosition={formData.coverPosition}
        coverPicUrl={meData.user.coverUrl}
        profilePicUrl={meData.user.picUrl}
        setCoverPosition={setCoverPosition}
        handleProfilePictureChange={handleProfilePictureChange}
        handleCoverChange={handleCoverChange}
      />
      {meData.user.isProvider ? (
        <ProviderEditorForm
          isDeleteLoading={isDeleteLoading}
          activeTab={activeTab}
          formData={formData}
          handleDeleteOpen={() => setDeleteOpen(true)}
          setActiveTab={setActiveTab}
          openVerificationModal={openVerificationModal}
          handleInputChange={handleInputChange}
          handleSelectChange={handleSelectChange}
          handleSubmit={handleSubmit}
        />
      ) : (
        <UserEditorForm
          isDeleteLoading={isDeleteLoading}
          formData={formData}
          handleDeleteOpen={() => setDeleteOpen(true)}
          openVerificationModal={openVerificationModal}
          handleSubmit={handleSubmit}
          handleInputChange={handleInputChange}
        />
      )}
    </Fragment>
  );
};

const LoadingView = () => {
  return (
    <Fragment>
      <LoadingHeader />
      <Container maxWidth="sm" sx={{ marginBottom: 2 }}>
        <Grid container spacing={2}>
          <Skeleton
            sx={{ marginTop: 2, marginBottom: 2 }}
            variant="rounded"
            animation="pulse"
            width={"100%"}
            height={60}
          />
          <Skeleton
            sx={{ marginBottom: 2 }}
            variant="rounded"
            animation="pulse"
            width={"100%"}
            height={60}
          />
          <Skeleton
            sx={{ marginBottom: 2 }}
            variant="rounded"
            animation="pulse"
            width={"100%"}
            height={60}
          />
        </Grid>
      </Container>
    </Fragment>
  );
};

type DeleteProps = {
  open: boolean;
  handleClose: () => void;
  handleDelete: () => void;
};

const DeleteModal = ({ open, handleClose, handleDelete }: DeleteProps) => {
  const { t } = useTranslation();
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {t("delete_modal.title")}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {t("delete_modal.content")}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "space-between" }}>
        <Button onClick={handleClose}>{t("delete_modal.close")}</Button>
        <Button onClick={handleDelete} color="error" autoFocus>
          {t("delete_modal.remove")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
