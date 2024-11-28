import { getMe } from "../api/meApi";
import { validateToken } from "../api/authApi";
import { useAuth } from "../hooks/authHook";
import {
  DefinedInitialDataOptions,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";

type MeData = any; // replace with the actual type of data returned by getMe
type MeError = any; // replace with the actual type of error returned by getMe

type TokenData = any; // replace with the actual type of data returned by validateToken
type TokenError = any; // replace with the actual type of error returned by validateToken

export const useMe = (options?: DefinedInitialDataOptions) => {
  const { isLoggedIn } = useAuth();
  return useQuery<MeData, MeError>({
    queryFn: getMe,
    enabled: isLoggedIn(),
    staleTime: 1000 * 60 * 10,
    ...options,
    queryKey: ["me"],
  });
};

export const useValidateToken = (
  options?: Omit<UseQueryOptions<TokenData, TokenError>, "queryKey">,
) =>
  useQuery<TokenData, TokenError>({
    queryKey: ["fakeToken"],
    queryFn: validateToken,
    staleTime: 1000 * 60 * 5,
    ...options,
  });
