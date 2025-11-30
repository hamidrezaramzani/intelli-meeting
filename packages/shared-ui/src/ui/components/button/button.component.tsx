import clsx from "clsx";

import type { ButtonProps } from "./button.type";

export const Button = ({
  children,
  className,
  fullWidth = true,
  variant = "default",
  ...props
}: ButtonProps) => {
  const baseStyles =
    "px-4 py-2 font-regular text-sm cursor-pointer rounded-md transition-colors disabled:cursor-not-allowed disabled:opacity-50";

  const variantStyles = {
    default:
      "bg-slate-800 text-white border-black hover:bg-slate-900 focus:bg-indigo-900",
    primary:
      "bg-blue-600 text-white border-blue-600 hover:bg-blue-700 focus:bg-blue-800",
    secondary:
      "bg-gray-200 text-black border-gray-300 hover:bg-gray-300 focus:bg-gray-400",
  };

  return (
    <button
      type="button"
      className={clsx(
        baseStyles,
        variantStyles[variant],
        fullWidth && "w-full",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
};
