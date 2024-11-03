import { useMutation, useQueryClient } from "react-query";
import { deleteUser } from "../api/meApi";
import { enqueueError, enqueueSuccess } from "../enqueueHelper";
import { useAuth } from "../hooks/authHook";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const useDeleteMutation = () => {
  const { removeAuth } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation(deleteUser, {
    onSuccess: (data: any) => {
      removeAuth();
      queryClient.invalidateQueries({ queryKey: ["me"] });
      enqueueSuccess(t(`messages.success.${data.message}`));
      navigate("/");
    },
    onError: (error: any) =>
      enqueueError(t(`messages.errors.${error.response.data.message}`)),
  });
};
