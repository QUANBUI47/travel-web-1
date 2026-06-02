-- =====================================================================
-- Migration: Sprint 4 — Schema Pivot
-- =====================================================================
-- Phương án: Path A — Strategy 3a' Hybrid (giữ data hiện có)
-- Pattern an toàn: ALTER COLUMN TYPE ... USING (in-place convert),
-- KHÔNG dùng DROP+ADD COLUMN cho ID vì làm mất hết row.
--
-- Bao gồm 13 nhóm thay đổi:
--   1. UUID native type cho mọi PK + FK
--   2. Drop HotelBooking model + BookingType enum (ADR-001)
--   3. Pricing Pattern C cho Tour (ADR-002)
--   4. Thêm TourOption (ADR-002)
--   5. TourDeparture: minParticipants, cancellationDeadline, actualCostPerPax
--   6. TourBooking: drop unitPrice/participants, add adults/children/infants/option/breakdown
--   7. Booking: drop bookingType/checkIn/checkOut/tourStartDate, add paymentDeadline
--   8. HotelAllotment mới (ADR-004) với CHECK first-day-of-month
--   9. Room.roomType enum mới
--  10. InquiryRequest mới (ADR-006)
--  11. TourItinerary.hotelId mới
--  12. Booking.userId / Review.userId: Cascade → Restrict
--  13. Partial indexes (ADR-003) + CHECK constraints data-integrity
--
-- ⚠️ Tiền điều kiện:
--   * Đã có Supabase daily backup (Free plan: 7 ngày) làm safety net
--   * Production: 0 booking thực tế, 9 destinations, 10 tours, 4 profiles
--   * SeoPage có thể chưa apply migration 20260526000000_seo_polymorphic
--     → migration này tự xử lý cả hai trường hợp (IF EXISTS / IF NOT EXISTS)
--
-- ⚠️ KHÔNG dùng BEGIN/COMMIT — Prisma engine đã wrap mỗi migration trong
--   transaction riêng. Nested BEGIN/COMMIT sẽ phá vỡ semantics.
-- =====================================================================

-- =====================================================================
-- 1. CREATE NEW ENUMS (defensive với IF NOT EXISTS)
-- =====================================================================
DO $$ BEGIN
  CREATE TYPE "SeoTargetType" AS ENUM ('TOUR', 'DESTINATION', 'HOTEL', 'STATIC');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "TourType" AS ENUM ('SERIES', 'PRIVATE', 'CORPORATE');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "RoomType" AS ENUM ('STANDARD', 'SUPERIOR', 'DELUXE', 'SUITE', 'FAMILY', 'OTHER');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "InquiryStatus" AS ENUM ('NEW', 'CONTACTED', 'QUOTED', 'CONVERTED', 'REJECTED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "InquiryTourType" AS ENUM ('PRIVATE', 'CORPORATE', 'GROUP', 'OTHER');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- =====================================================================
-- 2. DROP HOTEL BOOKING + cột booking_type (ADR-001)
-- =====================================================================
-- Drop bảng hotel_bookings (0 rows)
DROP TABLE IF EXISTS "hotel_bookings";

-- Drop cột bookings.booking_type TRƯỚC khi drop type BookingType
-- (column depends on type → phải xoá thứ tự ngược lại)
ALTER TABLE "bookings" DROP COLUMN IF EXISTS "booking_type";

-- Bây giờ mới có thể drop type BookingType
DROP TYPE IF EXISTS "BookingType";

-- =====================================================================
-- 2b. SAVE + DROP RLS POLICIES
-- =====================================================================
-- Lý do: Supabase RLS policies depend on cột (vd: profiles.id).
-- Postgres KHÔNG cho ALTER COLUMN TYPE khi có policy reference.
-- Cách an toàn: lưu policies vào TEMP TABLE, drop hết, sau khi ALTER xong
-- thì recreate. TEMP TABLE tự huỷ khi session kết thúc.
CREATE TEMP TABLE _sprint4_saved_policies AS
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  cmd,
  roles,
  qual       AS using_expr,
  with_check AS check_expr
FROM pg_policies
WHERE schemaname = 'public';

DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN SELECT schemaname, tablename, policyname FROM _sprint4_saved_policies LOOP
    EXECUTE format(
      'DROP POLICY IF EXISTS %I ON %I.%I',
      r.policyname, r.schemaname, r.tablename
    );
  END LOOP;
END $$;

-- =====================================================================
-- 3. DROP TẤT CẢ FK (cho phép convert column type)
-- =====================================================================
ALTER TABLE "activity_logs"     DROP CONSTRAINT IF EXISTS "activity_logs_user_id_fkey";
ALTER TABLE "bookings"          DROP CONSTRAINT IF EXISTS "bookings_user_id_fkey";
ALTER TABLE "destinations"      DROP CONSTRAINT IF EXISTS "destinations_region_id_fkey";
ALTER TABLE "hotels"            DROP CONSTRAINT IF EXISTS "hotels_destination_id_fkey";
ALTER TABLE "payments"          DROP CONSTRAINT IF EXISTS "payments_booking_id_fkey";
ALTER TABLE "reviews"           DROP CONSTRAINT IF EXISTS "reviews_hotel_id_fkey";
ALTER TABLE "reviews"           DROP CONSTRAINT IF EXISTS "reviews_tour_id_fkey";
ALTER TABLE "reviews"           DROP CONSTRAINT IF EXISTS "reviews_user_id_fkey";
ALTER TABLE "rooms"             DROP CONSTRAINT IF EXISTS "rooms_hotel_id_fkey";
ALTER TABLE "tour_bookings"     DROP CONSTRAINT IF EXISTS "tour_bookings_booking_id_fkey";
ALTER TABLE "tour_bookings"     DROP CONSTRAINT IF EXISTS "tour_bookings_departure_id_fkey";
ALTER TABLE "tour_bookings"     DROP CONSTRAINT IF EXISTS "tour_bookings_tour_id_fkey";
ALTER TABLE "tour_departures"   DROP CONSTRAINT IF EXISTS "tour_departures_tour_id_fkey";
ALTER TABLE "tour_itineraries"  DROP CONSTRAINT IF EXISTS "tour_itineraries_tour_id_fkey";
ALTER TABLE "tours"             DROP CONSTRAINT IF EXISTS "tours_destination_id_fkey";

-- SeoPage FK (nếu polymorphic đã được apply)
ALTER TABLE "seo_pages" DROP CONSTRAINT IF EXISTS "seo_pages_tour_id_fkey";
ALTER TABLE "seo_pages" DROP CONSTRAINT IF EXISTS "seo_pages_destination_id_fkey";
ALTER TABLE "seo_pages" DROP CONSTRAINT IF EXISTS "seo_pages_hotel_id_fkey";

-- =====================================================================
-- 4. CONVERT ID + FK: TEXT → UUID (IN-PLACE, preserve data)
-- =====================================================================
-- profiles: id đã là UUID-format string từ Supabase Auth → cast OK
ALTER TABLE "profiles" ALTER COLUMN "id" SET DATA TYPE UUID USING "id"::uuid;

-- regions
ALTER TABLE "regions" ALTER COLUMN "id" SET DATA TYPE UUID USING "id"::uuid;

-- destinations
ALTER TABLE "destinations"
  ALTER COLUMN "id"        SET DATA TYPE UUID USING "id"::uuid,
  ALTER COLUMN "region_id" SET DATA TYPE UUID USING "region_id"::uuid;

-- hotels
ALTER TABLE "hotels"
  ALTER COLUMN "id"             SET DATA TYPE UUID USING "id"::uuid,
  ALTER COLUMN "destination_id" SET DATA TYPE UUID USING "destination_id"::uuid;

-- rooms
ALTER TABLE "rooms"
  ALTER COLUMN "id"       SET DATA TYPE UUID USING "id"::uuid,
  ALTER COLUMN "hotel_id" SET DATA TYPE UUID USING "hotel_id"::uuid;

-- tours
ALTER TABLE "tours"
  ALTER COLUMN "id"             SET DATA TYPE UUID USING "id"::uuid,
  ALTER COLUMN "destination_id" SET DATA TYPE UUID USING NULLIF("destination_id", '')::uuid;

-- tour_departures
ALTER TABLE "tour_departures"
  ALTER COLUMN "id"      SET DATA TYPE UUID USING "id"::uuid,
  ALTER COLUMN "tour_id" SET DATA TYPE UUID USING "tour_id"::uuid;

-- tour_itineraries
ALTER TABLE "tour_itineraries"
  ALTER COLUMN "id"      SET DATA TYPE UUID USING "id"::uuid,
  ALTER COLUMN "tour_id" SET DATA TYPE UUID USING "tour_id"::uuid;

-- bookings (0 rows nên cast luôn an toàn)
ALTER TABLE "bookings"
  ALTER COLUMN "id"      SET DATA TYPE UUID USING "id"::uuid,
  ALTER COLUMN "user_id" SET DATA TYPE UUID USING "user_id"::uuid;

-- tour_bookings (0 rows)
ALTER TABLE "tour_bookings"
  ALTER COLUMN "id"           SET DATA TYPE UUID USING "id"::uuid,
  ALTER COLUMN "booking_id"   SET DATA TYPE UUID USING "booking_id"::uuid,
  ALTER COLUMN "tour_id"      SET DATA TYPE UUID USING "tour_id"::uuid,
  ALTER COLUMN "departure_id" SET DATA TYPE UUID USING NULLIF("departure_id", '')::uuid;

-- reviews (0 rows)
ALTER TABLE "reviews"
  ALTER COLUMN "id"       SET DATA TYPE UUID USING "id"::uuid,
  ALTER COLUMN "user_id"  SET DATA TYPE UUID USING "user_id"::uuid,
  ALTER COLUMN "hotel_id" SET DATA TYPE UUID USING NULLIF("hotel_id", '')::uuid,
  ALTER COLUMN "tour_id"  SET DATA TYPE UUID USING NULLIF("tour_id", '')::uuid;

-- payments (0 rows)
ALTER TABLE "payments"
  ALTER COLUMN "id"         SET DATA TYPE UUID USING "id"::uuid,
  ALTER COLUMN "booking_id" SET DATA TYPE UUID USING "booking_id"::uuid;

-- activity_logs (có rows, user_id có thể là TEXT-format UUID)
ALTER TABLE "activity_logs"
  ALTER COLUMN "id"        SET DATA TYPE UUID USING "id"::uuid,
  ALTER COLUMN "user_id"   SET DATA TYPE UUID USING NULLIF("user_id", '')::uuid,
  ALTER COLUMN "entity_id" SET DATA TYPE UUID USING NULLIF("entity_id", '')::uuid;

-- seo_pages
ALTER TABLE "seo_pages" ALTER COLUMN "id" SET DATA TYPE UUID USING "id"::uuid;

-- system_settings, legal_contents
ALTER TABLE "system_settings" ALTER COLUMN "id" SET DATA TYPE UUID USING "id"::uuid;
ALTER TABLE "legal_contents"  ALTER COLUMN "id" SET DATA TYPE UUID USING "id"::uuid;

-- =====================================================================
-- 5. BOOKING: drop hotel-related cols, add paymentDeadline
-- =====================================================================
ALTER TABLE "bookings"
  DROP COLUMN IF EXISTS "booking_type",
  DROP COLUMN IF EXISTS "check_in",
  DROP COLUMN IF EXISTS "check_out",
  DROP COLUMN IF EXISTS "tour_start_date",
  ADD COLUMN  IF NOT EXISTS "payment_deadline" TIMESTAMP(3);

-- =====================================================================
-- 6. TOURS: Pricing Pattern C
-- =====================================================================
-- Thêm cột giá mới
ALTER TABLE "tours"
  ADD COLUMN IF NOT EXISTS "price_adult"             DECIMAL(14,0) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "price_child"             DECIMAL(14,0) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "price_infant"            DECIMAL(14,0) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "single_supplement_price" DECIMAL(14,0),
  ADD COLUMN IF NOT EXISTS "estimated_cost"          DECIMAL(14,0);

-- Backfill: copy price_from → price_adult cho 10 tour hiện có
UPDATE "tours"
SET "price_adult" = COALESCE("price_from", 0)
WHERE "price_from" IS NOT NULL AND "price_adult" = 0;

-- Drop các cột pricing cũ
ALTER TABLE "tours"
  DROP COLUMN IF EXISTS "price_from",
  DROP COLUMN IF EXISTS "duration_text";

-- Convert tour_type: TEXT → TourType enum (in-place với mapping)
DO $$
DECLARE
  col_type TEXT;
BEGIN
  SELECT data_type INTO col_type
  FROM information_schema.columns
  WHERE table_name = 'tours' AND column_name = 'tour_type';

  IF col_type IS NOT NULL AND col_type <> 'USER-DEFINED' THEN
    -- Hiện đang là TEXT / VARCHAR → cần convert
    EXECUTE 'ALTER TABLE "tours" ALTER COLUMN "tour_type" DROP DEFAULT';
    EXECUTE $alter$
      ALTER TABLE "tours"
      ALTER COLUMN "tour_type" SET DATA TYPE "TourType" USING (
        CASE upper(COALESCE("tour_type", 'SERIES'))
          WHEN 'PRIVATE'    THEN 'PRIVATE'::"TourType"
          WHEN 'CORPORATE'  THEN 'CORPORATE'::"TourType"
          ELSE 'SERIES'::"TourType"
        END
      )
    $alter$;
  END IF;
END $$;

ALTER TABLE "tours"
  ALTER COLUMN "tour_type" SET DEFAULT 'SERIES',
  ALTER COLUMN "tour_type" SET NOT NULL;

-- =====================================================================
-- 7. TOUR DEPARTURES: thêm field cho minParticipants, deadline, cost
-- =====================================================================
ALTER TABLE "tour_departures"
  ADD COLUMN IF NOT EXISTS "min_participants"      INTEGER,
  ADD COLUMN IF NOT EXISTS "cancellation_deadline" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "actual_cost_per_pax"   DECIMAL(14,0);

-- =====================================================================
-- 8. TOUR BOOKINGS: Pattern C — drop unit_price/participants, add multi-pax
-- =====================================================================
ALTER TABLE "tour_bookings"
  DROP COLUMN IF EXISTS "unit_price",
  DROP COLUMN IF EXISTS "participants",
  ADD COLUMN  IF NOT EXISTS "adults"               INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN  IF NOT EXISTS "children"             INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN  IF NOT EXISTS "infants"              INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN  IF NOT EXISTS "is_single_supplement" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN  IF NOT EXISTS "option_id"            UUID;

-- price_breakdown JSONB NOT NULL — tour_bookings có 0 rows nên add trực tiếp được
ALTER TABLE "tour_bookings"
  ADD COLUMN IF NOT EXISTS "price_breakdown" JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE "tour_bookings"
  ALTER COLUMN "price_breakdown" DROP DEFAULT;

-- =====================================================================
-- 9. TOUR ITINERARIES: add hotel_id
-- =====================================================================
ALTER TABLE "tour_itineraries"
  ADD COLUMN IF NOT EXISTS "hotel_id" UUID;

-- =====================================================================
-- 10. ROOMS: add room_type enum
-- =====================================================================
ALTER TABLE "rooms"
  ADD COLUMN IF NOT EXISTS "room_type" "RoomType" NOT NULL DEFAULT 'STANDARD';

-- =====================================================================
-- 11. SEO PAGES: ensure polymorphic columns (xử lý cả 2 case)
-- =====================================================================
-- Trường hợp A: prod đã có polymorphic (migration 20260526 đã apply)
--   → các cột target_type, tour_id, destination_id, hotel_id, custom_path đã tồn tại (kiểu TEXT)
--   → convert FK cols TEXT → UUID
-- Trường hợp B: prod chưa có polymorphic
--   → các cột chưa tồn tại, cần thêm mới (kiểu UUID luôn) và drop "slug"
DO $$
DECLARE
  has_target_type BOOLEAN;
  has_slug        BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name='seo_pages' AND column_name='target_type'
  ) INTO has_target_type;

  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name='seo_pages' AND column_name='slug'
  ) INTO has_slug;

  IF has_target_type THEN
    -- Case A: polymorphic đã có. Convert FK cols TEXT → UUID
    EXECUTE 'ALTER TABLE "seo_pages"
             ALTER COLUMN "tour_id"        SET DATA TYPE UUID USING NULLIF("tour_id",'''')::uuid,
             ALTER COLUMN "destination_id" SET DATA TYPE UUID USING NULLIF("destination_id",'''')::uuid,
             ALTER COLUMN "hotel_id"       SET DATA TYPE UUID USING NULLIF("hotel_id",'''')::uuid';
  ELSE
    -- Case B: chưa polymorphic. Drop slug, add columns mới
    IF has_slug THEN
      EXECUTE 'DROP INDEX IF EXISTS "seo_pages_slug_key"';
      EXECUTE 'ALTER TABLE "seo_pages" DROP COLUMN "slug"';
    END IF;
    EXECUTE 'ALTER TABLE "seo_pages"
             ADD COLUMN "target_type"    "SeoTargetType" NOT NULL DEFAULT ''STATIC'',
             ADD COLUMN "tour_id"        UUID,
             ADD COLUMN "destination_id" UUID,
             ADD COLUMN "hotel_id"       UUID,
             ADD COLUMN "custom_path"    TEXT';
    EXECUTE 'ALTER TABLE "seo_pages" ALTER COLUMN "target_type" DROP DEFAULT';
  END IF;
END $$;

-- =====================================================================
-- 12. CREATE NEW TABLES: hotel_allotments, tour_options, inquiry_requests
-- =====================================================================
CREATE TABLE IF NOT EXISTS "hotel_allotments" (
  "id"           UUID         NOT NULL,
  "hotel_id"     UUID         NOT NULL,
  "period_month" DATE         NOT NULL,
  "allotment"    INTEGER      NOT NULL,
  "booked_rooms" INTEGER      NOT NULL DEFAULT 0,
  "notes"        TEXT,
  "created_at"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at"   TIMESTAMP(3) NOT NULL,
  CONSTRAINT "hotel_allotments_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "tour_options" (
  "id"              UUID          NOT NULL,
  "tour_id"         UUID          NOT NULL,
  "name_vi"         TEXT          NOT NULL,
  "name_en"         TEXT,
  "description"     TEXT,
  "surcharge_adult" DECIMAL(14,0) NOT NULL DEFAULT 0,
  "surcharge_child" DECIMAL(14,0) NOT NULL DEFAULT 0,
  "sort_order"      INTEGER       NOT NULL DEFAULT 0,
  "is_active"       BOOLEAN       NOT NULL DEFAULT true,
  "created_at"      TIMESTAMP(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at"      TIMESTAMP(3)  NOT NULL,
  CONSTRAINT "tour_options_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "inquiry_requests" (
  "id"             UUID              NOT NULL,
  "full_name"      TEXT              NOT NULL,
  "email"          TEXT              NOT NULL,
  "phone"          TEXT              NOT NULL,
  "tour_type"      "InquiryTourType" NOT NULL,
  "group_size"     INTEGER,
  "preferred_date" DATE,
  "destination_id" UUID,
  "tour_id"        UUID,
  "message"        TEXT,
  "status"         "InquiryStatus"   NOT NULL DEFAULT 'NEW',
  "assigned_to_id" UUID,
  "internal_notes" TEXT,
  "created_at"     TIMESTAMP(3)      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at"     TIMESTAMP(3)      NOT NULL,
  CONSTRAINT "inquiry_requests_pkey" PRIMARY KEY ("id")
);

-- =====================================================================
-- 13. CREATE INDEXES
-- =====================================================================
CREATE INDEX        IF NOT EXISTS "hotel_allotments_period_month_idx"
  ON "hotel_allotments"("period_month");
CREATE UNIQUE INDEX IF NOT EXISTS "hotel_allotments_hotel_id_period_month_key"
  ON "hotel_allotments"("hotel_id", "period_month");

CREATE INDEX        IF NOT EXISTS "tour_options_tour_id_sort_order_idx"
  ON "tour_options"("tour_id", "sort_order");

CREATE INDEX        IF NOT EXISTS "inquiry_requests_status_idx"
  ON "inquiry_requests"("status");
CREATE INDEX        IF NOT EXISTS "inquiry_requests_created_at_idx"
  ON "inquiry_requests"("created_at");

CREATE INDEX        IF NOT EXISTS "bookings_user_id_idx"
  ON "bookings"("user_id");
CREATE INDEX        IF NOT EXISTS "destinations_region_id_is_active_idx"
  ON "destinations"("region_id", "is_active");

CREATE UNIQUE INDEX IF NOT EXISTS "seo_pages_tour_id_key"
  ON "seo_pages"("tour_id");
CREATE UNIQUE INDEX IF NOT EXISTS "seo_pages_destination_id_key"
  ON "seo_pages"("destination_id");
CREATE UNIQUE INDEX IF NOT EXISTS "seo_pages_hotel_id_key"
  ON "seo_pages"("hotel_id");
CREATE UNIQUE INDEX IF NOT EXISTS "seo_pages_custom_path_key"
  ON "seo_pages"("custom_path");
CREATE INDEX        IF NOT EXISTS "seo_pages_target_type_idx"
  ON "seo_pages"("target_type");

CREATE UNIQUE INDEX IF NOT EXISTS "tour_bookings_booking_id_key"
  ON "tour_bookings"("booking_id");

CREATE INDEX        IF NOT EXISTS "tour_departures_tour_id_start_date_idx"
  ON "tour_departures"("tour_id", "start_date");

CREATE INDEX        IF NOT EXISTS "tours_destination_id_idx"
  ON "tours"("destination_id");
CREATE INDEX        IF NOT EXISTS "tours_tour_type_idx"
  ON "tours"("tour_type");

-- Partial indexes (ADR-003) — query mặc định luôn filter is_active=true
CREATE INDEX IF NOT EXISTS "idx_destinations_active"
  ON "destinations"("region_id") WHERE "is_active" = true;
CREATE INDEX IF NOT EXISTS "idx_tours_active"
  ON "tours"("destination_id") WHERE "is_active" = true;
CREATE INDEX IF NOT EXISTS "idx_hotels_active"
  ON "hotels"("destination_id") WHERE "is_active" = true;

-- =====================================================================
-- 14. RE-ADD FOREIGN KEYS
-- =====================================================================
ALTER TABLE "activity_logs"
  ADD CONSTRAINT "activity_logs_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "profiles"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "destinations"
  ADD CONSTRAINT "destinations_region_id_fkey"
  FOREIGN KEY ("region_id") REFERENCES "regions"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "hotels"
  ADD CONSTRAINT "hotels_destination_id_fkey"
  FOREIGN KEY ("destination_id") REFERENCES "destinations"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "rooms"
  ADD CONSTRAINT "rooms_hotel_id_fkey"
  FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "hotel_allotments"
  ADD CONSTRAINT "hotel_allotments_hotel_id_fkey"
  FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "tours"
  ADD CONSTRAINT "tours_destination_id_fkey"
  FOREIGN KEY ("destination_id") REFERENCES "destinations"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "tour_options"
  ADD CONSTRAINT "tour_options_tour_id_fkey"
  FOREIGN KEY ("tour_id") REFERENCES "tours"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "tour_departures"
  ADD CONSTRAINT "tour_departures_tour_id_fkey"
  FOREIGN KEY ("tour_id") REFERENCES "tours"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "tour_itineraries"
  ADD CONSTRAINT "tour_itineraries_tour_id_fkey"
  FOREIGN KEY ("tour_id") REFERENCES "tours"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "tour_itineraries"
  ADD CONSTRAINT "tour_itineraries_hotel_id_fkey"
  FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

-- ⚠️ Booking.userId & Review.userId: Cascade → Restrict (không lỡ xóa Profile làm mất lịch sử)
ALTER TABLE "bookings"
  ADD CONSTRAINT "bookings_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "profiles"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "tour_bookings"
  ADD CONSTRAINT "tour_bookings_booking_id_fkey"
  FOREIGN KEY ("booking_id") REFERENCES "bookings"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "tour_bookings"
  ADD CONSTRAINT "tour_bookings_tour_id_fkey"
  FOREIGN KEY ("tour_id") REFERENCES "tours"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "tour_bookings"
  ADD CONSTRAINT "tour_bookings_departure_id_fkey"
  FOREIGN KEY ("departure_id") REFERENCES "tour_departures"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "tour_bookings"
  ADD CONSTRAINT "tour_bookings_option_id_fkey"
  FOREIGN KEY ("option_id") REFERENCES "tour_options"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "reviews"
  ADD CONSTRAINT "reviews_hotel_id_fkey"
  FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "reviews"
  ADD CONSTRAINT "reviews_tour_id_fkey"
  FOREIGN KEY ("tour_id") REFERENCES "tours"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "reviews"
  ADD CONSTRAINT "reviews_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "profiles"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

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

ALTER TABLE "payments"
  ADD CONSTRAINT "payments_booking_id_fkey"
  FOREIGN KEY ("booking_id") REFERENCES "bookings"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "inquiry_requests"
  ADD CONSTRAINT "inquiry_requests_assigned_to_id_fkey"
  FOREIGN KEY ("assigned_to_id") REFERENCES "profiles"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

-- =====================================================================
-- 15. CHECK CONSTRAINTS — data integrity
-- =====================================================================

-- Tour Pricing Pattern C: giá luôn ≥ 0
ALTER TABLE "tours"
  DROP CONSTRAINT IF EXISTS "tours_pricing_non_negative_check";
ALTER TABLE "tours"
  ADD CONSTRAINT "tours_pricing_non_negative_check"
  CHECK ("price_adult" >= 0 AND "price_child" >= 0 AND "price_infant" >= 0);

-- TourDeparture: KHÔNG vượt max_participants (no overbooking)
ALTER TABLE "tour_departures"
  DROP CONSTRAINT IF EXISTS "tour_departures_no_overbooking";
ALTER TABLE "tour_departures"
  ADD CONSTRAINT "tour_departures_no_overbooking"
  CHECK ("max_participants" IS NULL OR "booked_count" <= "max_participants");

-- TourDeparture: số ≥ 0
ALTER TABLE "tour_departures"
  DROP CONSTRAINT IF EXISTS "tour_departures_non_negative";
ALTER TABLE "tour_departures"
  ADD CONSTRAINT "tour_departures_non_negative"
  CHECK ("booked_count" >= 0 AND ("min_participants" IS NULL OR "min_participants" >= 0));

-- TourBooking: số pax ≥ 0, ít nhất 1 adult
ALTER TABLE "tour_bookings"
  DROP CONSTRAINT IF EXISTS "tour_bookings_pax_non_negative";
ALTER TABLE "tour_bookings"
  ADD CONSTRAINT "tour_bookings_pax_non_negative"
  CHECK ("adults" >= 1 AND "children" >= 0 AND "infants" >= 0);

-- HotelAllotment: bookedRooms ≤ allotment, period_month phải là ngày 1
ALTER TABLE "hotel_allotments"
  DROP CONSTRAINT IF EXISTS "hotel_allotments_no_overbooking";
ALTER TABLE "hotel_allotments"
  ADD CONSTRAINT "hotel_allotments_no_overbooking"
  CHECK ("booked_rooms" <= "allotment" AND "booked_rooms" >= 0 AND "allotment" >= 0);

ALTER TABLE "hotel_allotments"
  DROP CONSTRAINT IF EXISTS "hotel_allotments_period_month_first_day";
ALTER TABLE "hotel_allotments"
  ADD CONSTRAINT "hotel_allotments_period_month_first_day"
  CHECK (EXTRACT(DAY FROM "period_month") = 1);

-- Review: exclusive target (hotel HOẶC tour, khớp với reviewable_type)
ALTER TABLE "reviews"
  DROP CONSTRAINT IF EXISTS "review_target_exclusive";
ALTER TABLE "reviews"
  ADD CONSTRAINT "review_target_exclusive"
  CHECK (
    ("reviewable_type" = 'HOTEL' AND "hotel_id" IS NOT NULL AND "tour_id" IS NULL)
    OR
    ("reviewable_type" = 'TOUR'  AND "tour_id"  IS NOT NULL AND "hotel_id" IS NULL)
  );

-- SeoPage: exclusive target (1 trong 4: tour / destination / hotel / custom_path)
ALTER TABLE "seo_pages"
  DROP CONSTRAINT IF EXISTS "seo_pages_exclusive_target";
ALTER TABLE "seo_pages"
  ADD CONSTRAINT "seo_pages_exclusive_target"
  CHECK (
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

-- =====================================================================
-- 16. RESTORE RLS POLICIES (đã được lưu ở section 2b)
-- =====================================================================
-- ⚠️ Quan trọng: sau khi convert id từ TEXT → UUID, các policy cũ dùng
-- pattern `(auth.uid())::text = id` sẽ fail vì `text = uuid` không có
-- operator. Rewrite về `auth.uid() = id` (cả hai cùng UUID).
DO $$
DECLARE
  r            RECORD;
  using_expr   TEXT;
  check_expr   TEXT;
  using_clause TEXT;
  check_clause TEXT;
  roles_str    TEXT;
BEGIN
  FOR r IN SELECT * FROM _sprint4_saved_policies LOOP
    -- Rewrite expressions để phù hợp với column type mới (UUID)
    using_expr := r.using_expr;
    check_expr := r.check_expr;

    IF using_expr IS NOT NULL THEN
      using_expr := replace(using_expr, '(auth.uid())::text', 'auth.uid()');
      using_expr := replace(using_expr, 'auth.uid()::text',   'auth.uid()');
    END IF;

    IF check_expr IS NOT NULL THEN
      check_expr := replace(check_expr, '(auth.uid())::text', 'auth.uid()');
      check_expr := replace(check_expr, 'auth.uid()::text',   'auth.uid()');
    END IF;

    using_clause := CASE
      WHEN using_expr IS NOT NULL AND length(using_expr) > 0
        THEN ' USING (' || using_expr || ')'
      ELSE ''
    END;
    check_clause := CASE
      WHEN check_expr IS NOT NULL AND length(check_expr) > 0
        THEN ' WITH CHECK (' || check_expr || ')'
      ELSE ''
    END;
    roles_str := array_to_string(r.roles, ', ');

    EXECUTE format(
      'CREATE POLICY %I ON %I.%I AS %s FOR %s TO %s%s%s',
      r.policyname,
      r.schemaname,
      r.tablename,
      r.permissive,
      r.cmd,
      roles_str,
      using_clause,
      check_clause
    );
  END LOOP;
END $$;

DROP TABLE IF EXISTS _sprint4_saved_policies;
