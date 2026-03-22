import { HomeService } from "@/services/home.service";
import { DestinationService } from "@/services/destination.service";
import { HomeClient } from "./home-client";

export default async function Home() {
  // Fetch settings and destinations in parallel
  const [initialData, allDestinations] = await Promise.all([
    HomeService.getSettings(),
    DestinationService.getAll()
  ]);

  return <HomeClient initialData={initialData} allDestinations={allDestinations} />;
}

