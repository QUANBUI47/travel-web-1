import type { SupportedLocale } from "@/types";
import type { LocalizedValue } from "@/lib/utils/i18n";

/**
 * Trích xuất giá trị đa ngôn ngữ từ thuộc tính động (Ví dụ Object SEO, Object Title)
 */
export function getLocalizedValue(
  data: LocalizedValue,
  locale: SupportedLocale = "vi",
  fallback: SupportedLocale = "vi",
): string {
  if (!data) return "";
  if (typeof data === "string") return data;

  const record = data as Record<string, string>;
  const value = record[locale];

  if (!value || value.trim() === "") {
    return record[fallback] || "";
  }

  return value;
}
