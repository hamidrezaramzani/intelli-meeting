"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  getSignUpFormSchema,
  SignUpInput,
} from "../../../lib/validations/auth";
import { TextInput, Button } from "@intelli-meeting/shared-ui";
import Link from "next/link";
import { useSignupMutation, useCheckEmailMutation } from "@/services/api";

const SignUpPage = () => {
  const [signUp] = useSignupMutation();
  const [checkEmail] = useCheckEmailMutation();

  const checkIsEmailAlreadyUsed = async (email: string) => {
    const result = await checkEmail({ email }).unwrap();
    return result.isUnique;
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, touchedFields },
  } = useForm<SignUpInput>({
    resolver: zodResolver(getSignUpFormSchema(checkIsEmailAlreadyUsed)),
  });

  const onSubmit = async (data: SignUpInput) => {
    console.log("✅ Valid data:", data);
    await signUp(data).unwrap();
  };

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="w-96">
        <div className="flex justify-center items-center flex-col mt-6">
          <Link href="/">
            <img src="/logo.png" alt="logo" className="w-32" />
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
              type="text"
              label="Name"
              placeholder="Enter name"
              {...register("name")}
              error={touchedFields?.name ? errors.name?.message : ""}
            />

            <TextInput
              type="text"
              label="Email"
              placeholder="Enter email(example@mail.com)"
              {...register("email")}
              error={touchedFields.email ? errors.email?.message : ""}
            />

            <TextInput
              type="password"
              label="Password"
              placeholder="Enter password"
              {...register("password")}
              error={touchedFields?.password ? errors.password?.message : ""}
            />

            <TextInput
              type="password"
              label="Confirm password"
              placeholder="Enter confirm password"
              {...register("confirmPassword")}
              error={
                touchedFields?.confirmPassword
                  ? errors.confirmPassword?.message
                  : ""
              }
            />

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Signing up..." : "Sign up"}
            </Button>

            <div className="py-3 flex justify-center items-center">
              <p className="text-gray-600 text-regular text-center">
                Do you have an account?
                <Link href="/sign-in" className="text-gray-800 ml-2">
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
