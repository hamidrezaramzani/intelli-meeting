"use client";

import { Login } from "@intelli-meeting/shared-ui";
import { useAuthRedirect } from "@intelli-meeting/store";
import { useRouter } from "next/navigation";

const SignInPage = () => {
  const router = useRouter();
  useAuthRedirect({
    onRedirect: () => router.push("/"),
    type: "logged",
  });

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <Login navigate={router.push} />
    </div>
  );
};

export default SignInPage;
