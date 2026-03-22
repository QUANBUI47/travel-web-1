import { SupportedLocale } from "@/types";

/**
 * Trích xuất giá trị đa ngôn ngữ từ thuộc tính động (Ví dụ Object SEO, Object Title)
 * Nếu locale yêu cầu không tồn tại hoặc rỗng, tự động lấy tiếng Việt.
 * @param data Dữ liệu ngôn ngữ (VD: { vi: "...", en: "..." })
 * @param locale Ngôn ngữ hiện tại
 * @param fallback Ngôn ngữ mặc định dự phòng
 */
export function getLocalizedValue(
  data: Record<string, string> | any,
  locale: SupportedLocale = 'vi',
  fallback: SupportedLocale = 'vi'
): string {
  // Nếu dữ liệu không hợp lệ hoặc thuần là string, chỉ cần trả về
  if (!data) return "";
  if (typeof data === "string") return data;

  // Lấy dữ liệu theo ngôn ngữ (VD: { vi: "Hello", en: "" } -> "Hello")
  const value = data[locale];
  
  // Rơi vào fallback nếu trống string
  if (!value || value.trim() === "") {
    return data[fallback] || "";
  }

  return value;
}
