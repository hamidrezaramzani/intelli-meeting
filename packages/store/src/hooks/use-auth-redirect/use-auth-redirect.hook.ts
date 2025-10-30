"use client";
import { useEffect } from "react";
import { useSelector } from "react-redux";

import type { RootState } from "../../store";
import type { UseAuthRedirectArgs } from "./use-auth-redirect.type";

export const useAuthRedirect = ({ onRedirect, type }: UseAuthRedirectArgs) => {
  const auth = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (auth.isLoggedIn && type === "logged") {
      onRedirect();
    } else if (!auth.isLoggedIn && type === "unlogged") {
      onRedirect();
    }
  }, [auth.isLoggedIn, onRedirect, type]);

  return auth.isLoggedIn;
};
