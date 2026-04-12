import { HomeClient } from "./home-client";

import { HomeService } from "@/services/home.service";
import { DestinationService } from "@/services/destination.service";
import { TourService } from "@/services/tour.service";
import { serialize } from "@/lib/utils";

export const revalidate = 3600; // Revalidate every hour

export default async function Home() {
  // Fetch settings, destinations and featured tours in parallel
  const [initialData, allDestinations, featuredTours] = serialize(
    await Promise.all([
      HomeService.getSettings(),
      DestinationService.getAll(),
      TourService.getFeatured(8),
    ]),
  );

  return (
    <HomeClient
      allDestinations={allDestinations}
      featuredTours={featuredTours}
      initialData={initialData}
    />
  );
}
