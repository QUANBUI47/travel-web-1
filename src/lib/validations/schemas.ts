import type { ValidationTranslator } from "@/lib/i18n/validation";

import { z } from "zod";

import { COMMON_REGEX } from "./common";

export function buildValidationSchemas(t: ValidationTranslator) {
  // ADR-002 / Sprint 4: Pricing Pattern C. priceAdult bắt buộc và > 0; child/
  // infant ≥ 0 (default 0). Giữ thêm singleSupplementPrice + estimatedCost
  // optional cho reporting tương lai (ADR-007). tourType là enum
  // SERIES/PRIVATE/CORPORATE (ADR-006).
  const tourTypeSchema = z.enum(["SERIES", "PRIVATE", "CORPORATE"]);

  const TourOptionInputSchema = z.object({
    nameVi: z.string().min(2, t("tour_name_vi_min")).max(120),
    nameEn: z.string().max(120).optional().nullable(),
    description: z.string().max(2000).optional().nullable(),
    surchargeAdult: z.coerce
      .number()
      .min(0, t("price_non_negative"))
      .default(0),
    surchargeChild: z.coerce
      .number()
      .min(0, t("price_non_negative"))
      .default(0),
    sortOrder: z.coerce.number().int().min(0).optional(),
    isActive: z.boolean().optional(),
  });

  const TourOptionsInputSchema = z.array(TourOptionInputSchema);

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
    departurePoint: z.string().optional().nullable(),
    transport: z.string().optional().nullable(),
    tourType: tourTypeSchema.optional().nullable(),
    priceAdult: z.coerce.number().min(0, t("price_non_negative")).default(0),
    priceChild: z.coerce.number().min(0, t("price_non_negative")).default(0),
    priceInfant: z.coerce.number().min(0, t("price_non_negative")).default(0),
    singleSupplementPrice: z.coerce
      .number()
      .min(0, t("price_non_negative"))
      .optional()
      .nullable(),
    estimatedCost: z.coerce
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
    hotelId: z.string().uuid(t("uuid_invalid")).nullable().optional(),
  });

  const TourItinerariesInputSchema = z
    .array(TourItinerarySchema)
    .min(1, t("itinerary_min_days"));

  const TourDepartureInputSchema = z.object({
    startDate: z.coerce.date(),
    endDate: z.coerce.date().nullable().optional(),
    priceOverride: z.coerce.number().min(0).nullable().optional(),
    maxParticipants: z.coerce.number().int().positive().nullable().optional(),
    minParticipants: z.coerce.number().int().min(0).nullable().optional(),
    cancellationDeadline: z.coerce.date().nullable().optional(),
    actualCostPerPax: z.coerce.number().min(0).nullable().optional(),
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
    TourOptionInputSchema,
    TourOptionsInputSchema,
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
export type TourOptionInput = z.infer<SchemaBundle["TourOptionInputSchema"]>;
export type DestinationInput = z.infer<SchemaBundle["DestinationSchema"]>;
