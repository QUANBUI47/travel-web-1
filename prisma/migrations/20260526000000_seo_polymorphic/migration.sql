-- =====================================================================
-- Migration: Polymorphic SeoPage with exclusive-arc FKs
-- =====================================================================
-- Bối cảnh:
--   SeoPage cũ chỉ có `slug String @unique` (string tự do). Khi admin
--   đổi slug của Tour/Destination/Hotel, SeoPage row trỏ về slug cũ
--   bị orphan — vẫn tồn tại nhưng không còn URL nào dùng tới.
--
-- Thiết kế mới (Exclusive Arc pattern):
--   - target_type enum: TOUR | DESTINATION | HOTEL | STATIC
--   - tour_id, destination_id, hotel_id, custom_path — đúng 1 cột non-NULL
--   - FK cascade on delete → SeoPage tự dọn khi entity bị xóa
--   - CHECK constraint enforce tính exclusive ở DB level
--
-- ⚠️ DATA LOSS WARNING:
--   Trước khi chạy migration này, hãy backup bảng `seo_pages` nếu bạn có
--   dữ liệu thật. Schema cũ và mới KHÔNG tương thích — slug string không
--   thể auto-migrate sang FK vì không có thông tin target type. Migration
--   sẽ TRUNCATE bảng để bắt đầu sạch (admin nhập lại SEO override sau).
-- =====================================================================

-- Bước 1: Tạo enum target type
DO $$ BEGIN
  CREATE TYPE "SeoTargetType" AS ENUM ('TOUR', 'DESTINATION', 'HOTEL', 'STATIC');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Bước 2: Xóa data cũ (incompatible schema)
TRUNCATE TABLE "seo_pages";

-- Bước 3: Drop unique index + slug column cũ
DROP INDEX IF EXISTS "seo_pages_slug_key";
ALTER TABLE "seo_pages" DROP COLUMN IF EXISTS "slug";

-- Bước 4: Thêm các cột mới
ALTER TABLE "seo_pages"
  ADD COLUMN "target_type"     "SeoTargetType" NOT NULL,
  ADD COLUMN "tour_id"         TEXT,
  ADD COLUMN "destination_id"  TEXT,
  ADD COLUMN "hotel_id"        TEXT,
  ADD COLUMN "custom_path"     TEXT;

-- Bước 5: Foreign keys với cascade — entity bị xóa thì SeoPage cũng xóa
ALTER TABLE "seo_pages"
  ADD CONSTRAINT "seo_pages_tour_id_fkey"
    FOREIGN KEY ("tour_id") REFERENCES "tours"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "seo_pages"
  ADD CONSTRAINT "seo_pages_destination_id_fkey"
    FOREIGN KEY ("destination_id") REFERENCES "destinations"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "seo_pages"
  ADD CONSTRAINT "seo_pages_hotel_id_fkey"
    FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

-- Bước 6: Unique indexes — mỗi entity tối đa 1 SeoPage row.
-- (Postgres treat NULL là distinct → nhiều row có FK NULL vẫn OK.)
CREATE UNIQUE INDEX "seo_pages_tour_id_key"        ON "seo_pages"("tour_id");
CREATE UNIQUE INDEX "seo_pages_destination_id_key" ON "seo_pages"("destination_id");
CREATE UNIQUE INDEX "seo_pages_hotel_id_key"       ON "seo_pages"("hotel_id");
CREATE UNIQUE INDEX "seo_pages_custom_path_key"    ON "seo_pages"("custom_path");

-- Bước 7: Index phụ trợ cho query theo target_type
CREATE INDEX "seo_pages_target_type_idx" ON "seo_pages"("target_type");

-- Bước 8: CHECK constraint enforce Exclusive Arc.
-- Đúng 1 trong 4 cột non-NULL, và phải khớp với target_type.
ALTER TABLE "seo_pages"
  ADD CONSTRAINT "seo_pages_exclusive_target" CHECK (
    (
      "target_type" = 'TOUR'
      AND "tour_id"        IS NOT NULL
      AND "destination_id" IS NULL
      AND "hotel_id"       IS NULL
      AND "custom_path"    IS NULL
    ) OR (
      "target_type" = 'DESTINATION'
      AND "destination_id" IS NOT NULL
      AND "tour_id"        IS NULL
      AND "hotel_id"       IS NULL
      AND "custom_path"    IS NULL
    ) OR (
      "target_type" = 'HOTEL'
      AND "hotel_id"       IS NOT NULL
      AND "tour_id"        IS NULL
      AND "destination_id" IS NULL
      AND "custom_path"    IS NULL
    ) OR (
      "target_type" = 'STATIC'
      AND "custom_path"    IS NOT NULL
      AND "tour_id"        IS NULL
      AND "destination_id" IS NULL
      AND "hotel_id"       IS NULL
    )
  );
