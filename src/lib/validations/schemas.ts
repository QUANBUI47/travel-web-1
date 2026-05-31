import type { ValidationTranslator } from "@/lib/i18n/validation";

import { z } from "zod";

import { COMMON_REGEX } from "./common";

export function buildValidationSchemas(t: ValidationTranslator) {
  const TourSchema = z.object({
    nameVi: z.string().min(5, t("tour_name_vi_min")).max(200),
    nameEn: z.string().max(200).optional().nullable(),
    slug: z
      .string()
      .min(5, t("slug_min"))
      .regex(COMMON_REGEX.SLUG, t("slug_invalid")),
    destinationId: z.preprocess(
      (val) => (val === "" ? null : val),
      z.string().uuid(t("uuid_invalid")).nullable().optional(),
    ),
    description: z.string().min(20, t("description_min")).optional().nullable(),
    durationDays: z.coerce.number().int().min(1, t("duration_min")),
    durationText: z.string().optional().nullable(),
    departurePoint: z.string().optional().nullable(),
    transport: z.string().optional().nullable(),
    tourType: z.string().optional().nullable(),
    priceFrom: z.coerce
      .number()
      .min(0, t("price_non_negative"))
      .optional()
      .nullable(),
    oldPrice: z.coerce
      .number()
      .min(0, t("price_non_negative"))
      .optional()
      .nullable(),
    inclusions: z.any().optional(),
    exclusions: z.any().optional(),
    policy: z.any().optional(),
    tags: z.array(z.string()).default([]),
    imageUrls: z.array(z.string().url(t("image_url_invalid"))).default([]),
    isActive: z.boolean().default(true),
  });

  const TourItinerarySchema = z.object({
    dayNumber: z.number().int().min(1),
    title: z.string().min(5, t("itinerary_title_min")),
    description: z.string().optional().nullable(),
  });

  const TourItinerariesInputSchema = z
    .array(TourItinerarySchema)
    .min(1, t("itinerary_min_days"));

  const TourDepartureInputSchema = z.object({
    startDate: z.coerce.date(),
    endDate: z.coerce.date().nullable().optional(),
    priceOverride: z.coerce.number().min(0).nullable().optional(),
    maxParticipants: z.coerce.number().int().positive().nullable().optional(),
    notes: z.string().max(2000).nullable().optional(),
  });

  const TourDeparturesInputSchema = z.array(TourDepartureInputSchema);

  const TourUpdateSchema = TourSchema.partial();

  const DestinationSchema = z.object({
    nameVi: z.string().min(2, t("destination_name_vi_min")),
    nameEn: z.string().optional().nullable(),
    slug: z
      .string()
      .min(2, t("slug_min_short"))
      .regex(COMMON_REGEX.SLUG, t("slug_invalid")),
    regionId: z.string().uuid(t("uuid_invalid")),
    imageUrl: z
      .string()
      .url(t("image_url_invalid"))
      .optional()
      .nullable()
      .or(z.literal("")),
    imageUrls: z
      .array(z.string().url(t("image_url_invalid")))
      .optional()
      .default([]),
    description: z.string().optional().nullable(),
    sortOrder: z.number().int().default(0),
    isFeatured: z.boolean().optional().default(false),
    isActive: z.boolean().optional().default(true),
    latitude: z.number().optional().nullable(),
    longitude: z.number().optional().nullable(),
  });

  const idSchema = z.string().uuid(t("uuid_invalid"));
  const tourIdSchema = z.string().uuid(t("tour_id_invalid"));

  const listQuerySchema = z.object({
    page: z.coerce.number().int().min(1),
    limit: z.coerce.number().int().min(1).max(100),
    search: z.string().max(500).optional(),
  });

  return {
    TourSchema,
    TourUpdateSchema,
    TourItinerarySchema,
    TourItinerariesInputSchema,
    TourDepartureInputSchema,
    TourDeparturesInputSchema,
    DestinationSchema,
    idSchema,
    tourIdSchema,
    listQuerySchema,
  };
}

type SchemaBundle = ReturnType<typeof buildValidationSchemas>;

export type TourInput = z.infer<SchemaBundle["TourSchema"]>;
export type TourDepartureInput = z.infer<
  SchemaBundle["TourDepartureInputSchema"]
>;
export type DestinationInput = z.infer<SchemaBundle["DestinationSchema"]>;
