type Variant = "default" | "primary" | "secondary";

interface CustomButtonProps {
  fullWidth?: boolean;
  variant?: Variant;
}
export type ButtonProps = React.ComponentProps<"button"> & CustomButtonProps;
