import type { ButtonProps } from "./button.type";

export const Button = ({ children }: ButtonProps) => (
  <button className="w-full bg-brand-600 hover:bg-brand-500 transition-colors text-white font-regular text-lg text-center cursor-pointer rounded-xl p-3">
    {children}
  </button>
);
