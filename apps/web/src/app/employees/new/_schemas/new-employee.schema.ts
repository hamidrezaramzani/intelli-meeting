import { z } from "zod";

export const createEmployeeSchema = z.object({
  fullName: z.string("Full name is required").min(2, "Full name is too short"),
  position: z.string().min(1, "Position is required"),
});
