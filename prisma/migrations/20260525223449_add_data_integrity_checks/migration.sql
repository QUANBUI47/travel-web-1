-- ============================================================================
-- Add CHECK constraints để đảm bảo data integrity ở DB layer.
--
-- Lý do: Prisma schema không hỗ trợ CHECK constraint native (Issue
-- prisma/prisma#3388). Các constraint này bảo vệ DB khỏi data bẩn ở mọi đường
-- vào: Prisma Client, raw SQL, Supabase Studio, import scripts, sync jobs...
--
-- Tham chiếu: Issue 3 — Polymorphism CHECK constraints trong code review.
-- Trước khi chạy: scripts/audit-data-integrity.sql phải trả 0 ở mọi check.
-- ============================================================================

-- ─── BOOKINGS ────────────────────────────────────────────────────────────────

-- Polymorphism: booking_type HOTEL vs TOUR phải có đúng các trường ngày tương
-- ứng, không lẫn lộn.
--   HOTEL → check_in & check_out (check_out > check_in), không có tour_start_date
--   TOUR  → tour_start_date, không có check_in/check_out
ALTER TABLE "bookings"
  ADD CONSTRAINT "bookings_type_dates_check" CHECK (
    (
      booking_type = 'HOTEL'
      AND check_in        IS NOT NULL
      AND check_out       IS NOT NULL
      AND check_out       >  check_in
      AND tour_start_date IS NULL
    )
    OR
    (
      booking_type      = 'TOUR'
      AND tour_start_date IS NOT NULL
      AND check_in        IS NULL
      AND check_out       IS NULL
    )
  );

-- ─── REVIEWS ─────────────────────────────────────────────────────────────────

-- Polymorphism: HOTEL review → cần hotel_id; TOUR review → cần tour_id.
-- Hai field exclusive — không cho phép cả 2 cùng có giá trị.
ALTER TABLE "reviews"
  ADD CONSTRAINT "reviews_target_check" CHECK (
    (reviewable_type = 'HOTEL' AND hotel_id IS NOT NULL AND tour_id IS NULL)
    OR (reviewable_type = 'TOUR'  AND tour_id  IS NOT NULL AND hotel_id IS NULL)
  );

-- Rating trong khoảng 1-5 (chuẩn ngành du lịch Việt Nam).
ALTER TABLE "reviews"
  ADD CONSTRAINT "reviews_rating_range_check" CHECK (rating BETWEEN 1 AND 5);

-- ─── TOUR BOOKINGS ───────────────────────────────────────────────────────────

-- Mỗi tour booking phải có ít nhất 1 participant.
ALTER TABLE "tour_bookings"
  ADD CONSTRAINT "tour_bookings_participants_positive_check" CHECK (participants > 0);

-- ─── TOUR DEPARTURES ─────────────────────────────────────────────────────────

-- booked_count không bao giờ âm (chống bug khi decrement nhầm).
ALTER TABLE "tour_departures"
  ADD CONSTRAINT "tour_departures_booked_nonneg_check" CHECK (booked_count >= 0);

-- Chống OVERBOOKING ngay tại DB: nếu departure có giới hạn (max_participants),
-- booked_count không được vượt quá. Đây là lớp bảo vệ cuối cùng — code service
-- (Bước 6) sẽ thêm transaction-level lock để chống race condition.
ALTER TABLE "tour_departures"
  ADD CONSTRAINT "tour_departures_no_overbooking_check" CHECK (
    max_participants IS NULL OR booked_count <= max_participants
  );
