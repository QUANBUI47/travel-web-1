import { z } from "zod";

const emailField = z
  .string()
  .trim()
  .min(1, "email_required")
  .email("invalid_email");

export const passwordSchema = z
  .string()
  .min(8, "password_min_length")
  .regex(/[A-Z]/, "password_uppercase")
  .regex(/[a-z]/, "password_lowercase")
  .regex(/[0-9]/, "password_number");

export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1, "password_required"),
});

export const signupSchema = z
  .object({
    fullName: z.string().trim().min(2, "fullname_required").max(120),
    email: emailField,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "password_required"),
    terms: z
      .string()
      .optional()
      .refine((v) => v === "on" || v === "true", "terms_required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "password_mismatch",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: emailField,
});

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, "password_required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "password_mismatch",
    path: ["confirmPassword"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
