export type TextInputProps = React.ComponentProps<"input"> & {
  label: string;
  type: "text" | "password";
  error?: string;
};
