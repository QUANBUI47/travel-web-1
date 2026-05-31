import type { DestinationInput, TourInput } from "@/lib/validations/schemas";

import {
  Destination as PrismaDestination,
  Region as PrismaRegion,
  Tour as PrismaTour,
} from "@prisma/client";

export type Region = PrismaRegion;

export type Destination = PrismaDestination & {
  region?: Region;
  /** Present after `prisma generate` (schema: image_urls). */
  imageUrls?: string[];
};

export type CreateDestinationInput = DestinationInput;
export type UpdateDestinationInput = Partial<CreateDestinationInput>;

export type TourItinerary = {
  id: string;
  tourId: string;
  dayNumber: number;
  title: string;
  description: string | null;
  sortOrder: number;
};

/**
 * Tour type cho UI/API.
 *
 * Đã sang Pricing Pattern C (ADR-002) từ Sprint 4: priceAdult / priceChild /
 * priceInfant / singleSupplementPrice. Decimal được chuyển thành number sẵn
 * để dễ serialize qua RSC.
 *
 * `priceFrom` được giữ làm alias `= priceAdult` để các component hiển thị cũ
 * (tour-card, booking-widget, trending-section, …) tiếp tục chạy mà chưa cần
 * refactor. Sẽ remove ở Sprint 5+ khi multi-pax UI sẵn sàng.
 *
 * `durationText` đã bị drop khỏi schema — chỉ tồn tại optional ở type level
 * cho phép gradual cleanup. Component nên fallback `t("days", { count: durationDays })`.
 */
export type Tour = Omit<
  PrismaTour,
  | "priceAdult"
  | "priceChild"
  | "priceInfant"
  | "singleSupplementPrice"
  | "estimatedCost"
  | "oldPrice"
  | "tags"
  | "inclusions"
  | "exclusions"
  | "policy"
> & {
  priceAdult: number;
  priceChild: number;
  priceInfant: number;
  singleSupplementPrice: number | null;
  estimatedCost: number | null;
  /** @deprecated alias of priceAdult — Pattern C migration backward-compat. */
  priceFrom: number;
  oldPrice: number | null;
  tags: string[];
  inclusions: string;
  exclusions: string;
  policy: string;
  /** @deprecated cột đã drop ở Sprint 4. Dùng `t("days", { count: durationDays })`. */
  durationText?: string | null;
  transport?: string | null;
  tourType?: string | null;
  departurePoint?: string | null;
  destination?: Destination;
  itineraries?: TourItinerary[];
  departures?: TourDeparture[];
};

export type DestinationWithTours = Destination & {
  tours?: Tour[];
};

export type DepartureStatus = "AVAILABLE" | "FULL" | "CANCELLED";

export type TourDeparture = {
  id: string;
  tourId: string;
  startDate: Date | string;
  endDate?: Date | string | null;
  priceOverride: number | null;
  maxParticipants: number | null;
  minParticipants: number | null;
  bookedCount: number;
  cancellationDeadline: Date | string | null;
  actualCostPerPax: number | null;
  status: DepartureStatus;
  notes?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
};

export type { TourInput };
