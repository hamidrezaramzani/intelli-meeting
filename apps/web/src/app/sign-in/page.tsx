"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, TextInput } from "@intelli-meeting/shared-ui";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import type { AppDispatch, RootState } from "@/store";

import { useSigninMutation } from "@/services/api";
import { setCredentials } from "@/store/auth";

import type { SignInInput } from "../../../lib/validations/auth";

import { getSignInFormSchema } from "../../../lib/validations/auth";

const SignInPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  const [signIn, { isSuccess }] = useSigninMutation();

  const schema = getSignInFormSchema();
  const resolver = zodResolver(schema);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, touchedFields },
  } = useForm<SignInInput>({
    resolver,
  });

  if (auth.isLoggedIn) {
    router.push("/");
    return null;
  }

  const onSubmit = async (data: SignInInput) => {
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
    <div className="w-full h-screen flex justify-center items-center">
      <div className="w-96">
        <div className="flex justify-center items-center flex-col mt-6">
          <Link href="/">
            <img alt="logo" className="w-32" src="/logo.png" />
          </Link>
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
          <form onSubmit={handleSubmit(onSubmit)}>
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

            <Button disabled={isSubmitting || isSuccess} type="submit">
              Sign in
            </Button>

            <div className="py-3 flex justify-center items-center">
              <p className="text-gray-600 text-regular text-center">
                Don’t have an account?
                <Link className="text-gray-800 ml-2" href="/sign-up">
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
