import { atom, useRecoilState } from "recoil";
import { VerificationMode } from "../types/enums";

const verification = atom({
  key: "verification",
  default: {
    open: false,
    mode: VerificationMode.FORGOT_PASSWORD,
    originalMode: VerificationMode.FORGOT_PASSWORD,
  },
});

export const useVerificationModalHook = () => {
  const [verificationState, setVerificationState] =
    useRecoilState(verification);

  const setVerificationOpen = (value: boolean) => {
    setVerificationState((prev) => ({ ...prev, open: value }));
  };

  const setVerificationMode = (value: VerificationMode) => {
    setVerificationState((prev) => ({ ...prev, mode: value }));
  };
  const setVerification = (
    open: boolean,
    mode: VerificationMode,
    originalMode: VerificationMode,
  ) => {
    setVerificationState({ open, mode, originalMode });
  };
  return {
    open: verificationState.open,
    mode: verificationState.mode,
    originalMode: verificationState.originalMode,
    setVerificationOpen,
    setVerificationMode,
    setVerification,
  };
};
