/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { PiCaretDownLight } from "react-icons/pi";

import type { SelectMultipleInputProps } from "./select-multiple-input.type";

export const SelectMultipleInput = ({
  label,
  error,
  width,
  value,
  options,
  onChange,
  onBlur,
}: SelectMultipleInputProps) => {
  const widthClass = !width ? "w-full" : width === "full" ? "w-full" : "w-1/2";
  const [open, setOpen] = useState(false);

  const toggleValue = (v: string) => {
    if (value.includes(v)) {
      onChange(value.filter((item) => item !== v));
    } else {
      onChange([...value, v]);
    }
  };

  return (
    <div className="mb-5 rounded-md">
      {label && (
        <label className="block mb-2 text-sm font-roboto  font-medium text-gray-500">
          {label}
        </label>
      )}

      <div className={`relative ${widthClass}`}>
        <div
          tabIndex={0}
          onBlur={onBlur}
          onClick={() => setOpen((prev) => !prev)}
          className={`bg-white border rounded-xl p-2.5 text-sm font-roboto  min-h-[40px] cursor-pointer flex flex-wrap gap-2 items-center
            ${error ? "border-red-500" : "border-black"}
          `}
        >
          {value.length === 0 ? (
            <span className="text-gray-400">Select...</span>
          ) : (
            value.map((val) => {
              const op = options.find((o) => o.value === val)!;
              return (
                <span
                  className="flex items-center bg-gray-200 px-2 py-0.5 rounded-lg text-sm font-roboto "
                  key={val}
                >
                  {op.label}
                  <IoClose
                    className="ml-1 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleValue(val);
                    }}
                  />
                </span>
              );
            })
          )}

          <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <PiCaretDownLight />
          </span>
        </div>

        {open && (
          <div className="absolute z-20 bg-white border border-gray-300 rounded-xl mt-1 w-full shadow-lg max-h-52 overflow-auto">
            {options.map((opt) => {
              const selected = value.includes(opt.value);
              return (
                <div
                  key={opt.value}
                  onClick={() => toggleValue(opt.value)}
                  className={`px-3 py-2 cursor-pointer flex justify-between items-center text-sm font-roboto  hover:bg-gray-100
                    ${selected ? "bg-gray-100 font-medium" : ""}
                  `}
                >
                  {opt.label}
                  {selected && (
                    <span className="text-brand-600 font-bold">✔</span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {error && (
        <p className="mt-1 text-sm font-roboto  text-red-500 font-regular">{error}</p>
      )}
    </div>
  );
};
