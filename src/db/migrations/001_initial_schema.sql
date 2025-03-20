-- Migration: Initial schema
BEGIN;

-- Tạo bảng quản lý phiên bản schema
CREATE TABLE IF NOT EXISTS schema_version (
  id SERIAL PRIMARY KEY,
  version VARCHAR(50) NOT NULL,
  description TEXT,
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bao gồm tất cả các schema cơ bản
-- Nhà cung cấp
\i ../schemas/suppliers.sql

-- Nhân viên
\i ../schemas/employees.sql

-- Nguyên phụ liệu
\i ../schemas/materials.sql

-- Sản phẩm
\i ../schemas/products.sql

-- Định mức
\i ../schemas/product_standards.sql

-- Sản xuất
\i ../schemas/production.sql

-- Kho
\i ../schemas/inventory.sql

-- Cập nhật version schema
INSERT INTO schema_version (version, description, applied_at)
VALUES ('001', 'Initial schema', NOW());

COMMIT; 