-- Migration: Add fabric management
BEGIN;

-- Thêm các bảng quản lý vải
\i ../schemas/fabric_management.sql

-- Cập nhật version schema
INSERT INTO schema_version (version, description, applied_at)
VALUES ('002', 'Add fabric management', NOW());

COMMIT; 