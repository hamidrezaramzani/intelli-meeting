import { Button, MainLayout, TextInput } from "@intelli-meeting/shared-ui";
import logo from "../../assets/logo-transparent.png";
import { useNavigate } from "react-router";

export const LoginPage = () => {
  const handleClick = () => {
    chrome.tabs.create({
      url: "onboarding.html",
    });
  };

  const navigate = useNavigate();

  return (
    <div className="w-96 bg-white">
      <MainLayout navigate={(path) => navigate(path)}>
        <div className="flex justify-center items-center flex-col mt-6">
          <img src={logo} className="w-24" />
        </div>
        <div className="flex justify-center flex-col mt-3">
          <h3 className="text-black text-2xl mb-2 font-bold text-center">
            Log in to your account
          </h3>
          <p className="text-gray-600 text-md font-regular text-center ">
            Welcome back, please enter your details
          </p>
        </div>
        <div className="mt-4 px-3">
          <form>
            <TextInput type="text" label="Email" />
            <TextInput type="password" label="Password" />
            <Button>Login</Button>
            <div className="py-3 flex justify-center items-center">
              <p className="text-gray-600 text-regular text-center">
                Create an account
                <a
                  className="text-gray-300 ml-2"
                  href="http://localhost:3000/sign-in"
                  target="_blank"
                  onClick={handleClick}
                >
                  Sign up now
                </a>
              </p>
            </div>
          </form>
        </div>
      </MainLayout>
    </div>
  );
};
