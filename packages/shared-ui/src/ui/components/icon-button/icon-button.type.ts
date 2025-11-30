import type { ButtonProps } from "../button/button.type";

type Variant = "default" | "primary" | "secondary";

export interface IconButtonProps extends ButtonProps {
  size?: "lg" | "md" | "sm";
  variant?: Variant;
  isLoading?: boolean;
}
