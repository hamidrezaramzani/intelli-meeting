import type { ButtonProps } from "./button.type";

export const Button = ({ children }: ButtonProps) => (
  <button className="bg:white border px-4 py-2 font-regular text-sm cursor-pointer  hover:dark:text-white hover:bg-black transition-colors rounded-md border-black">
    {children}
  </button>
);
