import React, { Fragment, useEffect, useState } from "react";
import { LoadingHeader } from "./ProfileEditorHeader";
import {
  updateProfile,
  uploadCoverPicture,
  uploadProfilePicture,
} from "../../api/meApi";
import { UserEditor } from "./userEditor/UserEditor";
import { Container, Grid, Skeleton } from "@mui/material";
import { EmailStatus } from "../../types/enums";
import { useNavigate } from "react-router-dom";
import { enqueueError, enqueueSuccess } from "../../enqueueHelper";
import { useMe } from "../../queries/queries";
import { FormState } from "../../types/formState";
import { useTranslation } from "react-i18next";
import { ProviderEditor } from "./providerEditor/ProviderEditor";
import { Pictures } from "../../types/pictures";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  useForm,
  Resolver,
  FormProvider,
  SubmitHandler,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

const initialData: FormState = {
  emailStatus: EmailStatus.CONFIRMED,
  isProvider: false,
  coverPosition: "50% 50%",
  name: "",
  phoneNumber: "",
  serviceCategory: "",
  description: "",
  coverUrl: "",
  slug: "",
  socials: "",
};

export const ProfileEditor = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const schema = Yup.object().shape({
    name: Yup.string().required(t("editor.errors.name_required")),
    slug: Yup.string()
      .max(50, t("editor.errors.slug_too_long"))
      .matches(/^[a-z0-9-]+$/, t("editor.errors.slug_invalid_characters")),
    phoneNumber: Yup.string().matches(
      /^\+?[0-9]*$/,
      t("editor.errors.invalid_phone"),
    ),
    description: Yup.string().max(600, t("editor.errors.description_too_long")),
  });

  const form = useForm({
    resolver: yupResolver(schema) as Resolver<Partial<FormState>>,
    defaultValues: initialData,
  });
  const { reset } = form;

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

  const handlePictureChange = (
    key: keyof Pictures,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { files } = event.target;
    setPictureData({ ...pictureData, [key]: files?.[0] || null });
  };

  // Handle form submission logic
  const onSubmit: SubmitHandler<Partial<FormState>> = (
    data: Partial<FormState>,
  ) => {
    if (!data) return;
    const form = new FormData();
    form.append("name", data.name || "");
    form.append("phoneNumber", data.phoneNumber || "");
    form.append("description", data.description || "");
    form.append("address", JSON.stringify(data.address));
    form.append("coverPosition", data.coverPosition || "50% 50%");
    if (data.isProvider) {
      form.append("slug", data.slug || "");
      form.append("billingAddress", JSON.stringify(data.billingAddress));
      form.append("serviceCategory", data.serviceCategory || "");
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
    form.append("socials", data.socials || "");
    updateMe(form);
  };

  useEffect(() => {
    if (meData) {
      reset({
        name: meData.user.name,
        slug: meData.user.slug || "",
        subscriptionType: meData.user.subscriptionType,
        emailStatus: meData.user.emailStatus,
        isProvider: meData.user.isProvider,
        coverPosition: meData.user.coverPosition,
        phoneNumber: meData.user.phoneNumber || "",
        serviceCategory: meData.user.serviceCategory,
        description: meData.user.description,
        coverUrl: meData.user.coverUrl,
        address: meData.user.address,
        billingAddress: meData.user.billingAddress,
        socials: meData.user.socials,
      });
    }
  }, [meData, reset]);

  if (!meData || meDataLoading) return <LoadingView />;
  return (
    <Fragment>
      <FormProvider {...form}>
        {meData.user.isProvider ? (
          <ProviderEditor
            pictureData={pictureData}
            handlePictureChange={handlePictureChange}
            onSubmit={form.handleSubmit(onSubmit)}
          />
        ) : (
          <UserEditor
            pictureData={pictureData}
            handlePictureChange={handlePictureChange}
            onSubmit={form.handleSubmit(onSubmit)}
          />
        )}
      </FormProvider>
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
