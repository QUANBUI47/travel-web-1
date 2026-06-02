import type { TourType } from "@prisma/client";

/**
 * Map giá trị tourType từ DB → key i18n để dịch trong UI.
 *
 * Sau Sprint 4 (ADR-006), `tourType` là enum `TourType` (SERIES / PRIVATE /
 * CORPORATE). Vẫn nhận lại chuỗi Vietnamese cũ ("Ghép đoàn", "Tour riêng")
 * để chuyển tiếp mượt cho dữ liệu cũ còn sót hoặc copy/paste từ admin.
 */
const TOUR_TYPE_KEYS: Record<string, string> = {
  SERIES: "tour_type_series",
  PRIVATE: "tour_type_private",
  CORPORATE: "tour_type_corporate",
  "Ghép đoàn": "tour_type_series",
  "Tour riêng": "tour_type_private",
  "Group tour": "tour_type_series",
  "Private tour": "tour_type_private",
};

const TRANSPORT_KEYS: Record<string, string> = {
  "Ô tô": "transport_bus",
  "Máy bay": "transport_plane",
  "Tàu thủy": "transport_ship",
  "Tàu hỏa": "transport_train",
  "Xe cao cấp": "transport_luxury_bus",
  Bus: "transport_bus",
  Flight: "transport_plane",
  "Luxury coach": "transport_luxury_bus",
};

type TranslateFn = (key: string) => string;

export function formatTourType(
  value: TourType | string | null | undefined,
  t: TranslateFn,
  fallbackKey = "tour_type_series",
): string {
  if (!value) return t(fallbackKey);
  const key = TOUR_TYPE_KEYS[value];

  return key ? t(key) : value;
}

export function formatTransport(
  value: string | null | undefined,
  t: TranslateFn,
  fallbackKey = "transport_bus",
): string {
  if (!value) return t(fallbackKey);
  const key = TRANSPORT_KEYS[value];

  return key ? t(key) : value;
}
