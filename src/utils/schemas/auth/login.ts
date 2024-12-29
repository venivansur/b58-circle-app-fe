import { z } from "zod";

export const loginFormSchema = z.object({
  emailOrUsername: z.string().min(3, "Email or username must be at least 3 characters long"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export type LoginForm = z.infer<typeof loginFormSchema>;
