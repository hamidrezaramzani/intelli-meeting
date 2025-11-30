import clsx from "clsx";

export type ChipProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: "default" | "primary" | "secondary";
  rounded?: boolean;
};

export const Chip = ({
  children,
  className,
  rounded = true,
  variant = "default",
  ...props
}: ChipProps) => {
  const baseStyles =
    "inline-flex items-center px-3 py-1 text-xs font-medium cursor-default select-none border transition-colors";

  const variantStyles = {
    default:
      "bg-slate-800 text-white border-black hover:bg-slate-900 focus:bg-indigo-900",
    primary:
      "bg-blue-600 text-white border-blue-600 hover:bg-blue-700 focus:bg-blue-800",
    secondary:
      "bg-gray-200 text-black border-gray-300 hover:bg-gray-300 focus:bg-gray-400",
  };

  return (
    <div
      className={clsx(
        baseStyles,
        variantStyles[variant],
        rounded && "rounded-full",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};
