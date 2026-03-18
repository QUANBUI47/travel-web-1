"use client";

import { z } from "zod";

// Schema cho Hero Section
export const HeroSchema = z.object({
  title: z.string().min(5, "Tiêu đề quá ngắn"),
  description: z.string().optional(),
  imageUrl: z.string().url("URL không hợp lệ").optional().or(z.literal("")),
});

// Schema cho Stats
export const StatsSchema = z.object({
  customers: z.string(),
  tours: z.string(),
  destinations: z.string(),
  partners: z.string(),
});

// Schema cho SEO
export const SeoSchema = z.object({
  siteTitle: z.string(),
  metaDescription: z.string(),
  faviconUrl: z.string().optional(),
  ogTitle: z.string().optional(),
  ogImage: z.string().optional(),
});
