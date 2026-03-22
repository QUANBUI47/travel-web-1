/**
 * Tiện ích xử lý đa ngôn ngữ cho dữ liệu động (JSON)
 */

export type LocalizedValue = string | Record<string, string> | null | undefined;

/**
 * Lấy giá trị theo ngôn ngữ hiện tại từ một object hoặc string
 * @param value Dữ liệu cần lấy (có thể là string hoặc object {vi, en})
 * @param locale Locale hiện tại ('vi' hoặc 'en')
 * @param fallback Locale dự phòng nếu không tìm thấy translation
 */
export function getLocalizedValue(
  value: LocalizedValue,
  locale: string = "vi",
  fallback: string = "vi"
): string {
  if (!value) return "";

  // Nếu là string thuần túy (dữ liệu cũ), trả về luôn
  if (typeof value === "string") return value;

  // Nếu là object {vi, en...}
  if (typeof value === "object") {
    const localized = value[locale] || value[fallback];
    if (localized) return localized;

    // Nếu vẫn không có, lấy key đầu tiên bất kỳ có giá trị
    const firstAvailable = Object.values(value).find((v) => typeof v === "string" && v);
    return (firstAvailable as string) || "";
  }

  return "";
}
