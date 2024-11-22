import React, { Fragment, useEffect, useState } from "react";
import { LoadingHeader } from "./ProfileEditorHeader";
import {
  updateProfile,
  uploadCoverPicture,
  uploadProfilePicture,
} from "../../api/meApi";
import { UserEditor } from "./userEditor/UserEditor";
import { Container, Grid, Skeleton, SelectChangeEvent } from "@mui/material";
import { EmailStatus } from "../../types/enums";
import { useNavigate } from "react-router-dom";
import { enqueueError, enqueueSuccess } from "../../enqueueHelper";
import { useMe } from "../../queries/queries";
import { FormState } from "../../types/formState";
import { useTranslation } from "react-i18next";
import { ProviderEditor } from "./providerEditor/ProviderEditor";
import { Pictures } from "../../types/pictures";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
  slug: "",
  socials: "",
};

export const ProfileEditor = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormState | undefined>();
  const [pictureData, setPictureData] = useState<Pictures>({
    profilePicture: null,
    cover: null,
  });

  //Queries
  const { data: meData, isLoading: meDataLoading, error } = useMe();
  useEffect(() => {
    if (error) {
      navigate("/");
    }
  }, [error]);
  //Mutations
  const { mutate: updateMe } = useMutation({
    mutationFn: updateProfile,
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      if (data.success) {
        enqueueSuccess(t(`messages.success.${data.message}`));
      } else {
        enqueueError(t(`messages.errors.${data.message}`));
      }
    },
    onError: (error: any) =>
      enqueueError(t(`messages.errors.${error.response.data.message}`)),
  });

  const { mutate: updateProfilePicture } = useMutation({
    mutationFn: uploadProfilePicture,
    onSuccess: (_data: any) => {
      // Empty function
    },
    onError: (error: any) =>
      enqueueError(t(`messages.errors.${error.response.data.message}`)),
  });

  const { mutate: updateCoverPicture } = useMutation({
    mutationFn: uploadCoverPicture,
    onSuccess: (_data: any) => {
      // Empty function
    },
    onError: (error: any) =>
      enqueueError(t(`messages.errors.${error.response.data.message}`)),
  });

  //Handlers and functions
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

  const handlePictureChange = (
    key: keyof Pictures,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { files } = event.target;
    setPictureData({ ...pictureData, [key]: files?.[0] || null });
  };

  // Handle form submission logic
  const handleSubmit = () => {
    // Create a FormData object to send the file and other data
    if (!formData) return;
    const form = new FormData();
    form.append("name", formData.name);
    form.append("phoneNumber", formData.phoneNumber);
    form.append("description", formData.description);
    form.append("address", JSON.stringify(formData.address));
    form.append("coverPosition", formData.coverPosition);
    if (formData.isProvider) {
      form.append("slug", formData.slug);
      form.append("billingAddress", JSON.stringify(formData.billingAddress));
      form.append("serviceCategory", formData.serviceCategory);
    }
    if (pictureData.profilePicture) {
      const profilePicForm = new FormData();
      profilePicForm.append("picture", pictureData.profilePicture);
      updateProfilePicture(profilePicForm); // Update the profile picture
    }
    if (pictureData.cover) {
      const coverForm = new FormData();
      coverForm.append("picture", pictureData.cover);
      updateCoverPicture(coverForm); // Update the cover picture
    }
    form.append("socials", formData.socials || "");
    updateMe(form);
  };

  useEffect(() => {
    if (meData) {
      setFormData({
        slug: meData.user.slug || "",
        subscriptionType: meData.user.subscriptionType,
        emailStatus: meData.user.emailStatus,
        isProvider: meData.user.isProvider,
        coverPosition: meData.user.coverPosition,
        name: meData.user.name,
        phoneNumber: meData.user.phoneNumber || "",
        serviceCategory: meData.user.serviceCategory,
        description: meData.user.description,
        coverUrl: meData.user.coverUrl,
        address: meData.user.address,
        billingAddress: meData.user.billingAddress,
        socials: meData.user.socials,
      });
    }
  }, [meData]);

  if (!meData || meDataLoading || !formData) return <LoadingView />;
  return (
    <Fragment>
      {meData.user.isProvider ? (
        <ProviderEditor
          formData={formData}
          pictureData={pictureData}
          handlePictureChange={handlePictureChange}
          setCoverPosition={setCoverPosition}
          setFormData={setFormData}
          handleInputChange={handleInputChange}
          handleSelectChange={handleSelectChange}
          handleSubmit={handleSubmit}
        />
      ) : (
        <UserEditor
          formData={formData}
          pictureData={pictureData}
          setFormData={setFormData}
          handlePictureChange={handlePictureChange}
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
