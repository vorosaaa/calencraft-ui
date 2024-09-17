import { atom, useRecoilState } from "recoil";
import { VerificationMode } from "../types/enums";

const verification = atom({
  key: "verification",
  default: {
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
    mode: VerificationMode,
    originalMode: VerificationMode,
  ) => {
    setVerificationState({ mode, originalMode });
  };
  return {
    mode: verificationState.mode,
    originalMode: verificationState.originalMode,
    setVerificationOpen,
    setVerificationMode,
    setVerification,
  };
};
