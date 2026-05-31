-- =====================================================================
-- Migration: Add is_active flag to destinations (soft-deactivation)
-- =====================================================================
-- Why:
--   * Destination thiếu cờ visibility, không thể "tạm ẩn" hoặc giấu
--     theo mùa mà không xóa cứng (mất luôn tour/hotel liên đới).
--   * Pattern đồng nhất với Hotel.is_active và Tour.is_active.
--
-- Cascade behavior:
--   * Khi destination.is_active = false, các public query (tour listing,
--     navbar, sitemap, ...) sẽ ẩn tour/hotel thuộc destination đó.
--   * Admin queries vẫn thấy tất cả để chỉnh sửa.
--
-- Backward-compatible: DEFAULT TRUE — record cũ vẫn hiển thị bình thường.
-- =====================================================================

ALTER TABLE "destinations"
  ADD COLUMN IF NOT EXISTS "is_active" BOOLEAN NOT NULL DEFAULT TRUE;

-- Hot path: lọc public destinations
CREATE INDEX IF NOT EXISTS "destinations_is_active_idx"
  ON "destinations" ("is_active");

-- Hot path: trang /diem-den?region=<slug> (lọc theo region + active)
CREATE INDEX IF NOT EXISTS "destinations_region_id_is_active_idx"
  ON "destinations" ("region_id", "is_active");
