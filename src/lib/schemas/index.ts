import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("invalid_email").min(1, "email_required"),
  password: z.string().min(6, "password_min_length"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const systemSettingsContentSchema = z.object({
  companyName: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  socialLinks: z.array(z.object({
    platform: z.string(),
    url: z.string().url(),
  })).optional(),
  seo: z.object({
    title: z.string(),
    description: z.string(),
    keywords: z.string(),
  }).optional(),
});

export type SystemSettingsContent = z.infer<typeof systemSettingsContentSchema>;
