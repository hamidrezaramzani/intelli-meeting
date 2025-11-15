import { z } from "zod";

export const positionSchema = z.object({
  title: z.string().min(1, "Title is required"),
});
