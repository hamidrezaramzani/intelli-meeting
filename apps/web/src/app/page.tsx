"use client";
import "@intelli-meeting/shared-ui/shared-ui.css";
import { Button, MainLayout } from "@intelli-meeting/shared-ui";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <div className="w-full flex justify-center h-screen">
      <div className="h-[calc(100vh-120px)]  w-full flex items-center flex-col mt-3">
        <MainLayout
          navigate={(path) => {
            router.push(path);
          }}
        >
          <div className="bg-white flex justify-center mt-3 flex-col items-center  h-[calc(100vh-120px)]  w-full">
            <div className="w-full pt-5 text-black flex gap-8 justify-center text-4xl font-black items-center mt-3">
              <h1>Intelli</h1>
              <div className="text-brand-700">|</div>
              <h1>Meeting</h1>
            </div>

            <div className="w-full py-5 flex gap-16 justify-center text-md font-regular items-center">
              <p className="text-shadow-gray-400 md:p-0 px-3 text-center">
                Intelli-Meeting – AI-powered online meeting assistant that
                records, analyzes, and summarizes meetings, identifying who said
                what.
              </p>
            </div>

            <div>
              <Button>GETTING START</Button>
            </div>
          </div>
        </MainLayout>
      </div>
    </div>
  );
}
