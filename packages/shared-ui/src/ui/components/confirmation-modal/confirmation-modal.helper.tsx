import ReactDOM from "react-dom/client";

import type { ConfirmationOptions } from "./confirmation-modal.type";

import { ConfirmationModal } from "./confirmation-modal.component";

export const confirmation = (
  options: ConfirmationOptions,
): Promise<boolean> => {
  return new Promise((resolve) => {
    const container = document.createElement("div");
    document.body.appendChild(container);

    const root = ReactDOM.createRoot(container);

    const handleClose = (result: boolean) => {
      root.unmount();
      container.remove();
      resolve(result);
    };

    root.render(
      <ConfirmationModal
        cancelText={options.cancelText}
        message={options.message}
        title={options.title}
        confirmText={options.confirmText}
        onCancel={() => handleClose(false)}
        onConfirm={() => handleClose(true)}
        open
      />,
    );
  });
};
