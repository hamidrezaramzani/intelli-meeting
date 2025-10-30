import { Login } from "@intelli-meeting/shared-ui";
import { useAuthRedirect } from "@intelli-meeting/store";
import { useNavigate } from "react-router";

export const LoginPage = () => {
  const navigate = useNavigate();
  const handleRedirect = (url: string) => {
    chrome.tabs.create({
      url,
    });
  };

  useAuthRedirect({
    onRedirect: () => {
      navigate("/");
    },
    type: "logged",
  });

  return (
    <div className="w-96 bg-white">
      <Login navigate={handleRedirect} />
    </div>
  );
};
