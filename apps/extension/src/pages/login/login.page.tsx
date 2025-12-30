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
      <Login
        copy={{
          title: "Sign in",
          description: "Sign in to access your account and all features.",
          emailLabel: "Email",
          emailPlaceholder: "Enter email(example@mail.com)",
          passwordLabel: "Password",
          passwordPlaceholder: "Enter password",
          submitLabel: "Sign in",
          noAccountPrompt: "Don’t have an account?",
          signUpLabel: "Sign up",
        }}
        links={{
          homeUrl: "http://localhost:3000",
          signUpUrl: "http://localhost:3000/sign-up",
        }}
        navigate={handleRedirect}
        toastMessages={{
          pending: "Signing in...",
          error: "Invalid credentials, please try again",
          success: "Signed in successfully!",
        }}
        validationMessages={{
          invalidEmail: "Invalid email address.",
          passwordMinLength: "Password must be at least 6 characters long.",
        }}
      />
    </div>
  );
};
