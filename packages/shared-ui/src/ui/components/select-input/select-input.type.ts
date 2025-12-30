export type SelectInputProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: string;
  width?: "full" | "half";
  placeholder: string;
  options: { value: number | string; label: string }[];
};
