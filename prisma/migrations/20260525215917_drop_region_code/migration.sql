-- Drop legacy `code` column on regions.
-- Reason: trùng vai trò với `slug` (cả 2 đều là unique identifier cho region).
-- Verified: không có code path nào trong src/ đọc/ghi field này.

-- Xóa unique index trước khi drop column
DROP INDEX IF EXISTS "regions_code_key";

-- Drop column
ALTER TABLE "regions" DROP COLUMN IF EXISTS "code";
