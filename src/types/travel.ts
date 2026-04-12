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

export type Tour = Omit<
  PrismaTour,
  "priceFrom" | "oldPrice" | "tags" | "inclusions" | "exclusions" | "policy"
> & {
  priceFrom: number;
  oldPrice: number | null;
  tags: string[];
  inclusions: string;
  exclusions: string;
  policy: string;
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
  bookedCount: number;
  status: DepartureStatus;
  notes?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
};

export type { TourInput };
