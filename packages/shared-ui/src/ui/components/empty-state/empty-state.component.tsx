import type { EmptyStateProps } from "./empty-state.type";

import { Button } from "../button";

export const EmptyState = ({
  title,
  description,
  actionLabel,
  isLoading,
  onAction,
  className = "",
}: EmptyStateProps) => {
  return (
    <div
      className={`w-full h-96 bg-slate-100 flex flex-col justify-center items-center rounded-md ${className}`}
    >
      <div className="flex flex-col items-center gap-1 mb-3">
        <h1 className="text-lg text-slate-700">{title}</h1>
        <p className="text-sm text-slate-500">{description}</p>
      </div>
      {actionLabel && onAction && (
        <Button fullWidth={false} isLoading={isLoading} onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
