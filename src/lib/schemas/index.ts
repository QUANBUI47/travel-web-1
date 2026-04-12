import { z } from "zod";

export {
  loginSchema,
  signupSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  passwordSchema,
  type LoginInput,
  type SignupInput,
} from "./auth";

export const systemSettingsContentSchema = z.object({
  companyName: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  socialLinks: z
    .array(
      z.object({
        platform: z.string(),
        url: z.string().url(),
      }),
    )
    .optional(),
  seo: z
    .object({
      title: z.string(),
      description: z.string(),
      keywords: z.string(),
    })
    .optional(),
});

export type SystemSettingsContent = z.infer<typeof systemSettingsContentSchema>;
