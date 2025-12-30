interface Option {
  label: string;
  value: string;
}

export interface SelectMultipleInputProps {
  label?: string;
  error?: string;
  width?: "full" | "half";
  placeholder?: string;
  value: string[];
  options: Option[];
  onChange: (val: string[]) => void;
  onBlur?: () => void;
}
