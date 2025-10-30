import { useAuthRedirect } from "@intelli-meeting/store";
import { useNavigate } from "react-router";

import type { ProtectRouteProps } from "./protect-router.type";

export const ProtectRoute = ({ children }: ProtectRouteProps) => {
  const navigate = useNavigate();
  useAuthRedirect({
    onRedirect: () => {
      navigate("/login");
    },
    type: "unlogged",
  });
  return children;
};
