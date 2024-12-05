import { z } from "zod";

export const ForgotFormSchema = z.object({
  emailOrUsername: z.string().min(3),
 
});

export type ForgotForm = z.infer<typeof ForgotFormSchema>;