export type TextInputProps = React.ComponentProps<"input"> & {
  label: string;
  type: "date" | "password" | "text" | "time" | "url";
  width?: "full" | "half";
  error?: string;
};
