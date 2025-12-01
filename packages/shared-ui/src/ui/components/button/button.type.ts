type Variant = "default" | "primary" | "secondary";

interface CustomButtonProps {
  fullWidth?: boolean;
  variant?: Variant;
  isLoading?: boolean;
}
export type ButtonProps = CustomButtonProps & React.ComponentProps<"button">;
