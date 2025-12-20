/* eslint-disable jsx-a11y/click-events-have-key-events */
import { MdClose } from "react-icons/md";

import type { ModalProps } from "./modal.type";

export const Modal = ({
  open,
  title,
  onClose,
  children,
  size = "md",
}: ModalProps) => {
  if (!open) return null;

  const sizeClass = {
    xs: "max-w-xs",
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
  }[size];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-2xl shadow-lg w-[90%] ${sizeClass} p-6 flex flex-col gap-4`}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-roboto  font-semibold text-gray-800">{title}</h2>
            {onClose && (
              <button
                className="text-xl cursor-pointer"
                type="button"
                onClick={onClose}
              >
                <MdClose />
              </button>
            )}
          </div>
        )}
        {children}
      </div>
    </div>
  );
};
