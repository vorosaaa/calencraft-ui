import { atom, useRecoilState } from "recoil";

const authState = atom({
  key: "authToken",
  default: {
    token: localStorage.getItem("token"),
  },
});

export const useAuth = () => {
  const [auth, setAuth] = useRecoilState(authState);

  const saveAuth = (token: string) => {
    localStorage.setItem("token", JSON.stringify(token));

    setAuth({ token: token });
  };

  const removeAuth = () => {
    localStorage.removeItem("token");

    setAuth({ token: null });
  };

  const isLoggedIn = () => {
    return !!auth.token;
  };

  return {
    auth,
    saveAuth,
    removeAuth,
    isLoggedIn,
  };
};
