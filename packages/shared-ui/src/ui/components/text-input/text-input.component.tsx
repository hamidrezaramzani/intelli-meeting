import type { TextInputProps } from "./text-input.type";

export const TextInput = ({
  label,
  error,
  width,
  ...props
}: TextInputProps) => {
  const widthClass = !width ? "w-full" : width === "full" ? "w-full" : "w-1/2";
  return (
    <div className="mb-5 rounded-md">
      <label className="block mb-2 text-sm font-roboto  font-medium text-gray-500 font-regular">
        {label}
      </label>

      <input
        className={`bg-white border font-regular rounded-xl text-gray-900 text-sm font-roboto  block ${widthClass} p-2.5 outline-none transition-colors
        ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-black focus:ring-brand-500 focus:border-brand-500"}
      `}
        {...props}
      />

      {error && (
        <p className="mt-1 text-sm font-roboto  text-red-500 font-regular">{error}</p>
      )}
    </div>
  );
};
