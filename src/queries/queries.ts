import { UseQueryOptions, useQuery } from "react-query";
import { getMe } from "../api/meApi";
import { validateToken } from "../api/authApi";
import { useAuth } from "../hooks/authHook";

type MeData = any; // replace with the actual type of data returned by getMe
type MeError = any; // replace with the actual type of error returned by getMe

type TokenData = any; // replace with the actual type of data returned by validateToken
type TokenError = any; // replace with the actual type of error returned by validateToken

export const useMe = (
  options?: Omit<UseQueryOptions<MeData, MeError>, "queryKey">,
) => {
  const { isLoggedIn } = useAuth();
  return useQuery<MeData, MeError>("me", getMe, {
    enabled: isLoggedIn(),
    staleTime: 1000 * 60 * 10,
    ...options,
  });
};

export const useValidateToken = (
  options?: Omit<UseQueryOptions<TokenData, TokenError>, "queryKey">,
) =>
  useQuery<TokenData, TokenError>("fakeToken", validateToken, {
    staleTime: 1000 * 60 * 5,
    ...options,
  });
