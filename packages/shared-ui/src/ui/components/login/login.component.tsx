import type { AppDispatch } from "@intelli-meeting/store";

import { zodResolver } from "@hookform/resolvers/zod";
import { setCredentials, useSigninMutation } from "@intelli-meeting/store";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";

import type { LoginFormValues, LoginProps } from "./login.type";

import { Button, TextInput } from "..";
import { getLoginFormSchema } from "./login.schema";

export const Login = ({
  navigate,
  copy,
  links,
  toastMessages,
  validationMessages,
}: LoginProps) => {
  const schema = getLoginFormSchema(validationMessages);
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
      pending: toastMessages.pending,
      error: toastMessages.error,
      success: {
        render: ({ data: loggedInUser }) => {
          dispatch(
            setCredentials({
              user: loggedInUser.user,
              token: loggedInUser.token,
            })
          );
          return toastMessages.success;
        },
      },
    });
  };

  return (
    <div className="w-96 bg-white">
      <ToastContainer position="bottom-right" />
      <div className="w-full">
        <div className="flex justify-center items-center flex-col mt-6">
          <button
            type="button"
            onClick={() => navigate(links.homeUrl)}
          >
          </button>
        </div>

        <div className="flex justify-center flex-col mt-3">
          <h3 className="text-black text-2xl font-roboto mb-2 font-bold text-center">
            {copy.title}
          </h3>
          <p className="text-gray-600 text-md font-roboto  font-regular text-center">
            {copy.description}
          </p>
        </div>

        <div className="mt-4 px-3">
          <form onSubmit={handleSubmit(handleSubmitForm)}>
            <TextInput
              label={copy.emailLabel}
              type="text"
              placeholder={copy.emailPlaceholder}
              {...register("email")}
              error={touchedFields.email ? errors.email?.message : ""}
            />

            <TextInput
              label={copy.passwordLabel}
              type="password"
              placeholder={copy.passwordPlaceholder}
              {...register("password")}
              error={touchedFields?.password ? errors.password?.message : ""}
            />

            <Button disabled={isLoading} type="submit">
              {copy.submitLabel}
            </Button>

            <div className="py-3 flex justify-center items-center">
              <p className="text-gray-600 text-regular text-center">
                {copy.noAccountPrompt}
                <button
                  className="text-gray-800 ml-2 cursor-pointer"
                  type="button"
                  onClick={() => navigate(links.signUpUrl)}
                >
                  {copy.signUpLabel}
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
