import { z } from "zod";

export const ResetFormSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters long"),
}
);

export type ResetForm = z.infer<typeof ResetFormSchema>;
