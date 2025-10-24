import type { ButtonProps } from "./button.type";

export const Button = ({ children, ...props }: ButtonProps) => (
  <button
    className="w-full  bg:white border px-4 py-2 font-regular text-sm cursor-pointer  hover:dark:text-white hover:bg-black transition-colors rounded-md border-black"
    {...props}
  >
    {children}
  </button>
);
