import type { TextInputProps } from "./text-input.type";

export const TextInput = ({ label, ...props }: TextInputProps) => (
  <div className="mb-3 rounded-md">
    <label className="block mb-2 text-sm font-medium text-gray-500 font-regular">
      {label}
    </label>
    <input
      className="bg-white border font-regular rounded-xl border-gray-300 text-gray-900 text-sm focus:ring-brand-500 focus:border-brand-500 block w-full p-2.5 outline-none"
      {...props}
    />
  </div>
);
