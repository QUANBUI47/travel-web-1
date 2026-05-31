-- ============================================================
-- Audit production trước Sprint 4 Schema Pivot (v2 — gộp 1 query)
-- ============================================================
-- Hướng dẫn:
-- 1. Mở Supabase dashboard → SQL Editor
-- 2. Paste TOÀN BỘ file này → Run
-- 3. Sẽ trả về MỘT bảng với 3 cột: metric / value / note
-- 4. Chụp ảnh / copy gửi lại
-- ============================================================

WITH
  row_counts AS (
    SELECT
      (SELECT COUNT(*) FROM profiles)         AS profiles,
      (SELECT COUNT(*) FROM regions)          AS regions,
      (SELECT COUNT(*) FROM destinations)     AS destinations,
      (SELECT COUNT(*) FROM hotels)           AS hotels,
      (SELECT COUNT(*) FROM rooms)            AS rooms,
      (SELECT COUNT(*) FROM tours)            AS tours,
      (SELECT COUNT(*) FROM tour_departures)  AS tour_departures,
      (SELECT COUNT(*) FROM tour_itineraries) AS tour_itineraries,
      (SELECT COUNT(*) FROM bookings)         AS bookings,
      (SELECT COUNT(*) FROM tour_bookings)    AS tour_bookings,
      (SELECT COUNT(*) FROM hotel_bookings)   AS hotel_bookings,
      (SELECT COUNT(*) FROM payments)         AS payments,
      (SELECT COUNT(*) FROM reviews)          AS reviews,
      (SELECT COUNT(*) FROM system_settings)  AS system_settings,
      (SELECT COUNT(*) FROM home_settings)    AS home_settings,
      (SELECT COUNT(*) FROM seo_pages)        AS seo_pages
  ),
  uuid_invalid AS (
    -- Đếm row có ID không đúng format UUID (cần biết để PART 0 có an toàn không)
    SELECT
      (SELECT COUNT(*) FROM profiles
        WHERE id !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$')
        AS profiles_invalid,
      (SELECT COUNT(*) FROM destinations
        WHERE id !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$')
        AS destinations_invalid,
      (SELECT COUNT(*) FROM tours
        WHERE id !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$')
        AS tours_invalid,
      (SELECT COUNT(*) FROM bookings
        WHERE id !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$')
        AS bookings_invalid
  ),
  active_bookings AS (
    SELECT COUNT(*) AS count FROM bookings
    WHERE status IN ('PENDING', 'PAID', 'CONFIRMED')
  )
SELECT 'profiles'         AS metric, profiles::text         AS value, 'số tài khoản' AS note FROM row_counts
UNION ALL SELECT 'regions',          regions::text,          'vùng miền (mong: 3)' FROM row_counts
UNION ALL SELECT 'destinations',     destinations::text,     'điểm đến' FROM row_counts
UNION ALL SELECT 'hotels',           hotels::text,           'khách sạn' FROM row_counts
UNION ALL SELECT 'rooms',            rooms::text,            'phòng' FROM row_counts
UNION ALL SELECT 'tours',            tours::text,            'tour' FROM row_counts
UNION ALL SELECT 'tour_departures',  tour_departures::text,  'lịch khởi hành' FROM row_counts
UNION ALL SELECT 'tour_itineraries', tour_itineraries::text, 'lịch trình tour' FROM row_counts
UNION ALL SELECT 'bookings',         bookings::text,         'đơn đặt chỗ TỔNG' FROM row_counts
UNION ALL SELECT 'tour_bookings',    tour_bookings::text,    'đơn tour' FROM row_counts
UNION ALL SELECT 'hotel_bookings',   hotel_bookings::text,   'đơn khách sạn' FROM row_counts
UNION ALL SELECT 'payments',         payments::text,         'thanh toán' FROM row_counts
UNION ALL SELECT 'reviews',          reviews::text,          'đánh giá' FROM row_counts
UNION ALL SELECT 'system_settings',  system_settings::text,  'cài đặt hệ thống' FROM row_counts
UNION ALL SELECT 'home_settings',    home_settings::text,    'home builder (mong: 0 hoặc 1)' FROM row_counts
UNION ALL SELECT 'seo_pages',        seo_pages::text,        'trang SEO custom' FROM row_counts
UNION ALL SELECT '---', '---', '--- KIỂM TRA ID FORMAT (mong tất cả = 0) ---'
UNION ALL SELECT 'profiles_id_không_uuid',     profiles_invalid::text,     'nếu > 0 → PART 0 sẽ fail' FROM uuid_invalid
UNION ALL SELECT 'destinations_id_không_uuid', destinations_invalid::text, 'nếu > 0 → PART 0 sẽ fail' FROM uuid_invalid
UNION ALL SELECT 'tours_id_không_uuid',        tours_invalid::text,        'nếu > 0 → PART 0 sẽ fail' FROM uuid_invalid
UNION ALL SELECT 'bookings_id_không_uuid',     bookings_invalid::text,     'nếu > 0 → PART 0 sẽ fail' FROM uuid_invalid
UNION ALL SELECT '---', '---', '--- BOOKING ĐANG ACTIVE (mong = 0) ---'
UNION ALL SELECT 'bookings_active', count::text, 'PENDING/PAID/CONFIRMED — nếu > 0 cần xử lý' FROM active_bookings;
