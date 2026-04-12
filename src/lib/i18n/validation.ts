import { getTranslations } from "next-intl/server";

/** Server-side validation messages (Zod, actions). */
export async function getValidationMessages() {
  return getTranslations("Validation");
}

export type ValidationTranslator = Awaited<
  ReturnType<typeof getValidationMessages>
>;
