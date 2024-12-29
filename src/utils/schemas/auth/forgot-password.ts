import { z } from "zod";

export const ForgotFormSchema = z.object({
  emailOrUsername: z.string().min(3, "Email or username must be at least 3 characters long"),
});

export type ForgotForm = z.infer<typeof ForgotFormSchema>;
