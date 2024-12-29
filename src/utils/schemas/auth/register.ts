import { z } from "zod";

export const registerFormSchema = z.object({
  fullName: z.string().min(1, "Name is required"), 
  email: z
    .string()
    .email("Invalid email format") 
    .min(3, "Email must be at least 3 characters long"), 
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export type RegisterForm = z.infer<typeof registerFormSchema>;
