import type { I18nString } from "@/types";

export type BilingualValue = I18nString | string | null | undefined;

export function parseBilingualValue(value: BilingualValue): I18nString {
  if (!value) return { vi: "", en: "" };
  if (typeof value === "string") return { vi: value, en: "" };

  return {
    vi: value.vi ?? "",
    en: value.en ?? "",
  };
}
