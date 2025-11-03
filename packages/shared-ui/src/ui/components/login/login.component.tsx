import type { AppDispatch } from "@intelli-meeting/store";

import { zodResolver } from "@hookform/resolvers/zod";
import { setCredentials, useSigninMutation } from "@intelli-meeting/store";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";

import type { LoginFormValues, LoginProps } from "./login.type";

import { Button, TextInput } from "..";
import logo from "../../../assets/logo.png";
import { getLoginFormSchema } from "./login.schema";

export const Login = ({ navigate }: LoginProps) => {
  const schema = getLoginFormSchema();
  const resolver = zodResolver(schema);

  const dispatch = useDispatch<AppDispatch>();

  const [signIn, { isLoading }] = useSigninMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
  } = useForm<LoginFormValues>({
    resolver,
  });

  const handleSubmitForm = async (data: LoginFormValues) => {
    void toast.promise(signIn(data).unwrap(), {
      pending: "Signing in...",
      error: "Invalid credentials, please try again",
      success: {
        render: ({ data: loggedInUser }) => {
          dispatch(
            setCredentials({
              user: loggedInUser.user,
              token: loggedInUser.token,
            }),
          );
          return "Signed in successfully!";
        },
      },
    });
  };

  return (
    <div className="w-96 bg-white">
      <ToastContainer />
      <div className="w-full">
        <div className="flex justify-center items-center flex-col mt-6">
          <button
            type="button"
            onClick={() => navigate("http://localhost:3000")}
          >
            <img alt="logo" className="w-32" src={logo} />
          </button>
        </div>

        <div className="flex justify-center flex-col mt-3">
          <h3 className="text-black text-2xl mb-2 font-bold text-center">
            Sign in
          </h3>
          <p className="text-gray-600 text-md font-regular text-center">
            Sign in to access your account and all features.
          </p>
        </div>

        <div className="mt-4 px-3">
          <form onSubmit={handleSubmit(handleSubmitForm)}>
            <TextInput
              label="Email"
              type="text"
              placeholder="Enter email(example@mail.com)"
              {...register("email")}
              error={touchedFields.email ? errors.email?.message : ""}
            />

            <TextInput
              label="Password"
              type="password"
              placeholder="Enter password"
              {...register("password")}
              error={touchedFields?.password ? errors.password?.message : ""}
            />

            <Button disabled={isLoading} type="submit">
              Sign in
            </Button>

            <div className="py-3 flex justify-center items-center">
              <p className="text-gray-600 text-regular text-center">
                Don’t have an account?
                <button
                  className="text-gray-800 ml-2 cursor-pointer"
                  type="button"
                  onClick={() => navigate("http://localhost:3000/sign-up")}
                >
                  Sign up
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
