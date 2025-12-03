export interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  isLoading?: boolean;
  onAction?: () => void;
  className?: string;
}
