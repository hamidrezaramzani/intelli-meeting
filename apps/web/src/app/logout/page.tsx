"use client";

import { logout, useAppDispatch } from "@intelli-meeting/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const LogoutPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    dispatch(logout());
    router.replace("/sign-in");
  }, [dispatch, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-gray-800">
      <div className="text-center space-y-2">
        <p className="text-xl font-semibold">Signing you out...</p>
        <p className="text-sm text-gray-500">Redirecting to sign in.</p>
      </div>
    </div>
  );
};

export default LogoutPage;
