"use client";

import { Button, MainLayout } from "@intelli-meeting/shared-ui";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { getUserMenuItems } from "@/lib/constants/user-menu";

export default function NotFound() {
  const router = useRouter();
  const menuItems = getUserMenuItems(router);

  const menus = [
    { id: 1, title: "Home", link: "/" },
    { id: 2, title: "About", link: "https://thehamidreza.ir" },
    { id: 3, title: "Contribute", link: "https://github.com/hamidrezaramzani" },
  ];

  return (
    <div className="w-full flex justify-center min-h-screen bg-white">
      <div className="min-h-[calc(100vh-120px)] w-full flex items-center flex-col mt-3 px-4">
        <MainLayout
          brandHref="/"
          brandLabel="Intelli Meetings"
          menuItems={menuItems}
          menus={menus}
          navigate={(path) => router.push(path)}
          registerLabel="Sign up"
          loginLabel="Sign in"
          openMenuLabel="Open main menu"
          userMenuProps={{
            avatarAlt: "User avatar",
            guestLabel: "Guest",
            renderGreeting: (name) => `Hello, ${name}!`,
          }}
        >
          <div className="bg-white flex flex-col items-center justify-center text-center w-full py-16 gap-4">
            <p className="text-6xl font-black text-gray-900">404</p>
            <p className="text-lg text-gray-700 font-semibold">
              We couldn&apos;t find that page.
            </p>
            <p className="text-sm text-gray-500 max-w-md">
              The link might be broken or the page may have been removed.
              Let&apos;s get you back on track.
            </p>
            <div className="flex items-center gap-3 mt-2">
              <Link href="/">
                <Button variant="primary">Go to Home</Button>
              </Link>
            </div>
          </div>
        </MainLayout>
      </div>
    </div>
  );
}
