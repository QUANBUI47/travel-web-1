/**
 * Tiện ích xử lý đa ngôn ngữ cho dữ liệu động (JSON)
 */

import type { I18nString } from "@/types/builder";

export type LocalizedValue =
  | string
  | I18nString
  | Record<string, string>
  | null
  | undefined;

/**
 * Lấy giá trị theo ngôn ngữ hiện tại từ một object hoặc string
 * @param value Dữ liệu cần lấy (có thể là string hoặc object {vi, en})
 * @param locale Locale hiện tại ('vi' hoặc 'en')
 * @param fallback Locale dự phòng nếu không tìm thấy translation
 */
export function getLocalizedValue(
  value: LocalizedValue,
  locale: string = "vi",
  fallback: string = "vi",
): string {
  if (!value) return "";

  // Nếu là string thuần túy (dữ liệu cũ), trả về luôn
  if (typeof value === "string") return value;

  if (typeof value === "object") {
    const record = value as Record<string, string>;
    const localized = record[locale] || record[fallback];

    if (localized) return localized;

    const firstAvailable = Object.values(record).find(
      (v) => typeof v === "string" && v,
    );

    return firstAvailable ?? "";
  }

  return "";
}
/**
 * Lấy giá trị từ Database theo pattern fieldVi / fieldEn
 * @param obj Object chứa dữ liệu (Tour, Destination...)
 * @param baseFieldName Tên trường gốc (ví dụ: 'name')
 * @param locale Locale hiện tại ('vi' hoặc 'en')
 */
export function getDBLocalizedValue(
  obj: Record<string, unknown> | null | undefined,
  baseFieldName: string,
  locale: string = "vi",
): string {
  if (!obj) return "";

  const suffix = locale === "en" ? "En" : "Vi";
  const localizedValue = obj[`${baseFieldName}${suffix}`];

  const fallback = obj[`${baseFieldName}Vi`];

  return (
    (typeof localizedValue === "string" ? localizedValue : "") ||
    (typeof fallback === "string" ? fallback : "") ||
    ""
  );
}

/**
 * Hook tiện ích (cho Client Component) để lấy hàm dịch dữ liệu DB
 */
export function useI18n(locale: string = "vi") {
  return {
    tDB: (obj: Record<string, unknown> | null | undefined, field: string) =>
      getDBLocalizedValue(obj, field, locale),
    locale,
  };
}
