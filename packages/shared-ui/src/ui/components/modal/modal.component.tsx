/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from "react";

interface CustomModalProps {
  open: boolean;
  title?: string;
  onClose?: () => void;
  children: React.ReactNode;
  width?: string;
}

export const Modal: React.FC<CustomModalProps> = ({
  open,
  title,
  onClose,
  children,
  width = "max-w-md",
}) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-2xl shadow-lg w-[90%] ${width} p-6 flex flex-col gap-4`}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        )}

        {children}
      </div>
    </div>
  );
};
