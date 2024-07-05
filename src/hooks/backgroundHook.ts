import { atom, useRecoilState } from "recoil";

const background = atom({
  key: "background",
  default: "",
});

export const useBackgroundHook = () => {
  const [backgroundState, setBackgroundState] = useRecoilState(background);

  const setBackground = (value: string) => setBackgroundState(value);

  return {
    background: backgroundState,
    setBackground,
  };
};
