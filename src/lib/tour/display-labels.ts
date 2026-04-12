/** Map stored Vietnamese DB labels → Tours i18n keys */
const TOUR_TYPE_KEYS: Record<string, string> = {
  "Ghép đoàn": "tour_type_group",
  "Tour riêng": "tour_type_private",
  "Group tour": "tour_type_group",
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
  value: string | null | undefined,
  t: TranslateFn,
  fallbackKey = "tour_type_group",
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
