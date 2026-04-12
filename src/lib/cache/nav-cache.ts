import { revalidateTag, unstable_cache } from "next/cache";

import { DestinationService } from "@/services/destination.service";
import { TourService } from "@/services/tour.service";

export const NAV_REGIONS_TAG = "nav-regions";
export const NAV_TOURS_TAG = "nav-tours";
export const NAV_DESTINATIONS_TAG = "nav-destinations";

export const getCachedNavRegions = unstable_cache(
  async () => DestinationService.getRegions(),
  [NAV_REGIONS_TAG],
  { tags: [NAV_REGIONS_TAG], revalidate: 3600 },
);

export const getCachedNavFeaturedTours = unstable_cache(
  async () => TourService.getFeatured(5),
  [NAV_TOURS_TAG],
  { tags: [NAV_TOURS_TAG], revalidate: 3600 },
);

export const getCachedNavFeaturedDestinations = unstable_cache(
  async () => DestinationService.getFeaturedForNav(5),
  [NAV_DESTINATIONS_TAG],
  { tags: [NAV_DESTINATIONS_TAG], revalidate: 3600 },
);

/** Gọi sau khi admin cập nhật tour / destination. */
export function revalidateNavCache() {
  revalidateTag(NAV_REGIONS_TAG);
  revalidateTag(NAV_TOURS_TAG);
  revalidateTag(NAV_DESTINATIONS_TAG);
}
