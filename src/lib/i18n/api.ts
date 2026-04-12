import { getTranslations } from "next-intl/server";

/** Server-side API response messages. */
export async function getApiMessages() {
  return getTranslations("API");
}
