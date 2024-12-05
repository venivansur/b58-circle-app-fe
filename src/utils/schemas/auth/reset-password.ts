import { z } from "zod";

export const ResetFormSchema = z.object({
    resetPassword: z.string().min(6),
    confirmResetPassword: z.string().min(6),
});

export type ResetForm = z.infer<typeof ResetFormSchema>;