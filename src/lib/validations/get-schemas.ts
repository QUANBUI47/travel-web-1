import { buildValidationSchemas } from "./schemas";

import { getValidationMessages } from "@/lib/i18n/validation";

export async function getValidationSchemas() {
  const t = await getValidationMessages();

  return buildValidationSchemas(t);
}
