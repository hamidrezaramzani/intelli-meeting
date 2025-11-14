import type { ButtonProps } from "./button.type";

export const Button = ({
  children,
  className = "",
  fullWidth = true,
  ...props
}: ButtonProps & { fullWidth?: boolean }) => {
  const baseStyles = `${fullWidth ? "w-full" : ""} border px-4 py-2 font-regular hover:bg-slate-900 focus:bg-indigo-900 text-sm cursor-pointer disabled:bg-gray-700 disabled:text-gray-200 disabled:cursor-not-allowed text-white bg-black transition-colors rounded-md border-black`;

  return (
    <button className={`${baseStyles} ${className}`} type="button" {...props}>
      {children}
    </button>
  );
};
