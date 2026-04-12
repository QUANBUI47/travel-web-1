import { ZodError } from "zod";

import { getValidationMessages } from "./validation";

export async function zodFirstMessage(
  error: ZodError,
  fallbackKey:
    | "invalid_params"
    | "invalid_tour_data"
    | "invalid_destination_data"
    | "invalid_itinerary_data"
    | "invalid_departure_data"
    | "invalid_homepage_config"
    | "invalid_system_config"
    | "uuid_invalid",
) {
  const t = await getValidationMessages();

  return error.issues[0]?.message || t(fallbackKey);
}
