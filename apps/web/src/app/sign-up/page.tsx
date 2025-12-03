"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, TextInput } from "@intelli-meeting/shared-ui";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { useCheckEmailMutation, useSignupMutation } from "@/services/api";

import type { SignUpFormValues } from "./_types";

import { getSignUpFormSchema } from "./_schemas";

const SignUpPage = () => {
  const router = useRouter();

  const [signUp, { isSuccess }] = useSignupMutation();
  const [checkEmail] = useCheckEmailMutation();

  const checkIsEmailAlreadyUsed = async (email: string) => {
    const result = await checkEmail({ email }).unwrap();
    return result.isUnique;
  };

  const schema = getSignUpFormSchema(checkIsEmailAlreadyUsed);

  const resolver = zodResolver(schema, undefined, { mode: "async" });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, touchedFields },
  } = useForm<SignUpFormValues>({
    resolver,
  });

  const onSubmit = async (data: SignUpFormValues) => {
    void toast.promise(signUp(data).unwrap(), {
      pending: "Please wait",
      error: "We have an error when creating new user, please try again",
      success: {
        render: () => {
          router.push("/sign-in");
          return "User created successfully";
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
            Sign up
          </h3>
          <p className="text-gray-600 text-md font-regular text-center">
            Sign up to unlock exclusive tools, insights, and personalized
            features made for you.
          </p>
        </div>

        <div className="mt-4 px-3">
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextInput
              label="Name"
              type="text"
              placeholder="Enter name"
              {...register("name")}
              error={touchedFields?.name ? errors.name?.message : ""}
            />

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

            <TextInput
              label="Confirm password"
              type="password"
              placeholder="Enter confirm password"
              {...register("confirmPassword")}
              error={
                touchedFields?.confirmPassword
                  ? errors.confirmPassword?.message
                  : ""
              }
            />

            <Button disabled={isSubmitting || isSuccess} type="submit">
              Sign up
            </Button>

            <div className="py-3 flex justify-center items-center">
              <p className="text-gray-600 text-regular text-center">
                Do you have an account?
                <Link className="text-gray-800 ml-2" href="/sign-in">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
