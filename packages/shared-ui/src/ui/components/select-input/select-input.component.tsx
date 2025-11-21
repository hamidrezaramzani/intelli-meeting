import { PiCaretDownLight } from "react-icons/pi";

import type { SelectInputProps } from "./select-input.type";

export const SelectInput = ({
  label,
  error,
  width,
  options,
  ...props
}: SelectInputProps) => {
  const widthClass = !width ? "w-full" : width === "full" ? "w-full" : "w-1/2";

  return (
    <div className="rounded-md">
      {label && (
        <label className="block mb-2 text-sm font-medium text-gray-500 font-regular">
          {label}
        </label>
      )}

      <div className={`relative ${widthClass}`}>
        <select
          className={`bg-white border font-regular rounded-xl text-gray-900 text-sm block w-full p-2.5 pr-8 outline-none appearance-none transition-colors
          ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-black focus:ring-brand-500 focus:border-brand-500"}
        `}
          {...props}
        >
          <option selected value="">
            Select an option
          </option>
          {options.map((option) => (
            <option key={`${option.value}-key`} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
          <PiCaretDownLight />
        </span>
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-500 font-regular">{error}</p>
      )}
    </div>
  );
};
