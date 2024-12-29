import { z } from "zod";

export const ResetFormSchema = z.object({
  resetPassword: z.string().min(6, "Password must be at least 6 characters long"),
  confirmResetPassword: z
    .string()
    .min(6, "Confirmation password must be at least 6 characters long"),
}).refine(
  (data) => data.resetPassword === data.confirmResetPassword,
  {
    message: "Passwords must match",
    path: ["confirmResetPassword"],
  }
);

export type ResetForm = z.infer<typeof ResetFormSchema>;
