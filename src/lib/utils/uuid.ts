const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/** Kiểm tra chuỗi có phải UUID v4 (RFC) hợp lệ (dùng làm fallback slug = id). */
export function isUuid(value: string): boolean {
  return UUID_RE.test(value);
}
