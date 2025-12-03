import type { HTMLMotionProps } from "motion/react";

export const getBounceEffect = (
  coefficient: number,
  from: "down" | "up" = "up",
): HTMLMotionProps<"div"> => ({
  animate: { y: 0, opacity: 1 },
  initial: { y: from === "up" ? -30 : 30, opacity: 0 },
  transition: {
    type: "spring",
    stiffness: 150,
    damping: 10,
    delay: 0.05 * coefficient,
  },
});
