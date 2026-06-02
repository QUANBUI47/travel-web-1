import type { DestinationInput, TourInput } from "@/lib/validations/schemas";

import {
  Destination as PrismaDestination,
  Region as PrismaRegion,
  Tour as PrismaTour,
  TourType,
} from "@prisma/client";

export type Region = PrismaRegion;
export { TourType };

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
  hotelId: string | null;
  dayNumber: number;
  title: string;
  description: string | null;
  sortOrder: number;
};

export type TourOption = {
  id: string;
  tourId: string;
  nameVi: string;
  nameEn: string | null;
  description: string | null;
  surchargeAdult: number;
  surchargeChild: number;
  sortOrder: number;
  isActive: boolean;
};

/**
 * Tour type cho UI/API.
 *
 * Pricing Pattern C (ADR-002): priceAdult/priceChild/priceInfant +
 * singleSupplementPrice. Decimal được chuyển thành number sẵn để serialize
 * qua React Server Components.
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
  oldPrice: number | null;
  tags: string[];
  inclusions: string;
  exclusions: string;
  policy: string;
  transport?: string | null;
  tourType?: TourType | null;
  departurePoint?: string | null;
  destination?: Destination;
  itineraries?: TourItinerary[];
  departures?: TourDeparture[];
  options?: TourOption[];
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
