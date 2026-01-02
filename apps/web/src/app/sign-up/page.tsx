"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, TextInput } from "@intelli-meeting/shared-ui";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { useCheckEmailMutation, useSignupMutation } from "@/services/api";

import type { SignUpFormValues } from "./_types";

import { getSignUpFormSchema } from "./_schemas";

const SignUpPage = () => {
  const router = useRouter();
  const { t } = useTranslation();

  const [signUp, { isSuccess }] = useSignupMutation();
  const [checkEmail] = useCheckEmailMutation();

  const checkIsEmailAlreadyUsed = async (email: string) => {
    const result = await checkEmail({ email }).unwrap();
    return result.isUnique;
  };

  const schema = getSignUpFormSchema(checkIsEmailAlreadyUsed, t);

  const resolver = zodResolver(schema, undefined, { mode: "async" });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, touchedFields },
  } = useForm<SignUpFormValues>({
    resolver,
  });

  const onSubmit = async (data: SignUpFormValues) => {
    await toast.promise(signUp(data).unwrap(), {
      pending: t("common:pleaseWait"),
      error: t("common:errors.createUser"),
      success: {
        render: () => {
          router.push("/sign-in");
          return t("common:messages.userCreated");
        },
      },
    });
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="flex justify-center items-center flex-col mt-6">
          <Link href="/">
            <img alt={t("common:logoAlt")} className="w-32" src="/logo.png" />
          </Link>
        </div>

        <div className="flex justify-center flex-col mt-3">
          <h3 className="text-black text-2xl font-roboto mb-2 font-bold text-center">
            {t("common:auth.signUp")}
          </h3>
          <p className="text-gray-600 text-md font-roboto  font-regular text-center">
            {t("common:auth.signUpDescription")}
          </p>
        </div>

        <div className="mt-4 px-3">
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextInput
              label={t("common:form.name")}
              type="text"
              placeholder={t("common:placeholders.name")}
              {...register("name")}
              error={touchedFields?.name ? errors.name?.message : ""}
            />

            <TextInput
              label={t("common:form.email")}
              type="text"
              placeholder={t("common:placeholders.email")}
              {...register("email")}
              error={touchedFields.email ? errors.email?.message : ""}
            />

            <TextInput
              label={t("common:form.password")}
              type="password"
              placeholder={t("common:placeholders.password")}
              {...register("password")}
              error={touchedFields?.password ? errors.password?.message : ""}
            />

            <TextInput
              label={t("common:form.confirmPassword")}
              type="password"
              placeholder={t("common:placeholders.confirmPassword")}
              {...register("confirmPassword")}
              error={
                touchedFields?.confirmPassword
                  ? errors.confirmPassword?.message
                  : ""
              }
            />

            <Button disabled={isSubmitting || isSuccess} type="submit">
              {t("common:auth.signUp")}
            </Button>

            <div className="py-3 flex justify-center items-center">
              <p className="text-gray-600 text-regular text-center">
                {t("common:auth.haveAccount")}
                <Link className="text-gray-800 ml-2" href="/sign-in">
                  {t("common:auth.signIn")}
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
