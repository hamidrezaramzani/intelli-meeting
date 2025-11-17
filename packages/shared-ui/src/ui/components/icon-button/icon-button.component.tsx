import clsx from "clsx";

import type { IconButtonProps } from "./icon-button.type";

export const IconButton = ({
  children,
  className,
  size = "md",
  variant = "default",
  ...props
}: IconButtonProps) => {
  const sizeStyles = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  const variantStyles = {
    default:
      "bg-black text-white border-black hover:bg-slate-900 focus:bg-indigo-900",
    primary:
      "bg-blue-600 text-white border-blue-600 hover:bg-blue-700 focus:bg-blue-800",
    secondary:
      "bg-gray-200 text-black border-gray-300 hover:bg-gray-300 focus:bg-gray-400",
  };

  const baseStyles =
    "cursor-pointer inline-flex items-center justify-center rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <button
      type="button"
      className={clsx(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
};
