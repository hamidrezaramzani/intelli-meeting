import { Header } from "../header";
import type { MainLayoutProps } from "./main-layout.type";

export const MainLayout = ({ children }: MainLayoutProps) => (
  <div className="w-full bg-brand-800">
    <Header />
    <div className="px-4">{children}</div>
  </div>
);
