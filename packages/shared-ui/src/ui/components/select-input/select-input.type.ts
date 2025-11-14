export type SelectInputProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  error?: string;
  width?: "full" | "half";
  options: { value: number | string; label: string }[];
};
