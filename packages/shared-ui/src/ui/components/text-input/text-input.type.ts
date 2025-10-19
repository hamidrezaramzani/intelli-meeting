import type { ComponentProps } from "react";

export type TextInputProps = {
  label: string;
  type: "text" | "password";
} & ComponentProps<"input">;
