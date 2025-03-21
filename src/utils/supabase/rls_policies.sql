-- Row Level Security (RLS) policies cho ERP Garment
-- File này chứa các policies cần thiết để triển khai bảo mật cấp độ hàng cho database

-------------------------------------------------------------------------------
-- ENABLE RLS ON ALL TABLES
-------------------------------------------------------------------------------

-- Bật RLS cho tất cả các bảng
ALTER TABLE fabrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE fabric_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE cutting_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE cutting_order_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE fabric_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE fabric_issue_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_check_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE quality_control_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE quality_defects ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

-------------------------------------------------------------------------------
-- POLICIES FOR ANONYMOUS USERS (PUBLIC)
-------------------------------------------------------------------------------

-- Không cho phép người dùng không xác thực thực hiện bất kỳ thao tác nào
-- Chúng ta sẽ chỉ sử dụng claimable JWT hoặc service role keys để truy cập

-------------------------------------------------------------------------------
-- POLICIES FOR AUTHENTICATED USERS (BASIC ACCESS)
-------------------------------------------------------------------------------

-- Chính sách chung cho người dùng đã xác thực: chỉ đọc dữ liệu
CREATE POLICY "Người dùng đã xác thực có thể xem fabrics" 
  ON fabrics FOR SELECT 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Người dùng đã xác thực có thể xem fabric_inventory" 
  ON fabric_inventory FOR SELECT 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Người dùng đã xác thực có thể xem suppliers" 
  ON suppliers FOR SELECT 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Người dùng đã xác thực có thể xem cutting_orders" 
  ON cutting_orders FOR SELECT 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Người dùng đã xác thực có thể xem cutting_order_details" 
  ON cutting_order_details FOR SELECT 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Người dùng đã xác thực có thể xem fabric_issues" 
  ON fabric_issues FOR SELECT 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Người dùng đã xác thực có thể xem fabric_issue_items" 
  ON fabric_issue_items FOR SELECT 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Người dùng đã xác thực có thể xem inventory_checks" 
  ON inventory_checks FOR SELECT 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Người dùng đã xác thực có thể xem inventory_check_items" 
  ON inventory_check_items FOR SELECT 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Người dùng đã xác thực có thể xem quality_control_records" 
  ON quality_control_records FOR SELECT 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Người dùng đã xác thực có thể xem quality_defects" 
  ON quality_defects FOR SELECT 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Người dùng đã xác thực có thể xem employees" 
  ON employees FOR SELECT 
  USING (auth.role() = 'authenticated');

-------------------------------------------------------------------------------
-- POLICIES FOR SPECIFIC ROLES
-------------------------------------------------------------------------------

-- Chính sách cho vai trò ADMIN (toàn quyền trên tất cả các bảng)
CREATE POLICY "Admin có toàn quyền trên fabrics" 
  ON fabrics FOR ALL 
  USING (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

CREATE POLICY "Admin có toàn quyền trên fabric_inventory" 
  ON fabric_inventory FOR ALL 
  USING (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

CREATE POLICY "Admin có toàn quyền trên suppliers" 
  ON suppliers FOR ALL 
  USING (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

CREATE POLICY "Admin có toàn quyền trên cutting_orders" 
  ON cutting_orders FOR ALL 
  USING (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

CREATE POLICY "Admin có toàn quyền trên cutting_order_details" 
  ON cutting_order_details FOR ALL 
  USING (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

CREATE POLICY "Admin có toàn quyền trên fabric_issues" 
  ON fabric_issues FOR ALL 
  USING (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

CREATE POLICY "Admin có toàn quyền trên fabric_issue_items" 
  ON fabric_issue_items FOR ALL 
  USING (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

CREATE POLICY "Admin có toàn quyền trên inventory_checks" 
  ON inventory_checks FOR ALL 
  USING (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

CREATE POLICY "Admin có toàn quyền trên inventory_check_items" 
  ON inventory_check_items FOR ALL 
  USING (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

CREATE POLICY "Admin có toàn quyền trên quality_control_records" 
  ON quality_control_records FOR ALL 
  USING (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

CREATE POLICY "Admin có toàn quyền trên quality_defects" 
  ON quality_defects FOR ALL 
  USING (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

CREATE POLICY "Admin có toàn quyền trên employees" 
  ON employees FOR ALL 
  USING (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

-- Chính sách cho vai trò MANAGER (quản lý kho vải)
CREATE POLICY "Manager có thể thêm/sửa/xem fabrics" 
  ON fabrics FOR ALL 
  USING (auth.jwt() -> 'app_metadata' ->> 'role' IN ('manager', 'admin'));

CREATE POLICY "Manager có thể thêm/sửa/xem fabric_inventory" 
  ON fabric_inventory FOR ALL 
  USING (auth.jwt() -> 'app_metadata' ->> 'role' IN ('manager', 'admin'));

CREATE POLICY "Manager có thể thêm/sửa/xem suppliers" 
  ON suppliers FOR ALL 
  USING (auth.jwt() -> 'app_metadata' ->> 'role' IN ('manager', 'admin'));

CREATE POLICY "Manager có thể thêm/sửa/xem cutting_orders" 
  ON cutting_orders FOR ALL 
  USING (auth.jwt() -> 'app_metadata' ->> 'role' IN ('manager', 'admin'));

CREATE POLICY "Manager có thể thêm/sửa/xem cutting_order_details" 
  ON cutting_order_details FOR ALL 
  USING (auth.jwt() -> 'app_metadata' ->> 'role' IN ('manager', 'admin'));

-- Chính sách cho vai trò QUALITY (kiểm soát chất lượng)
CREATE POLICY "Quality có thể thêm/sửa quality_control_records" 
  ON quality_control_records FOR ALL 
  USING (auth.jwt() -> 'app_metadata' ->> 'role' IN ('quality', 'manager', 'admin'));

CREATE POLICY "Quality có thể thêm/sửa quality_defects" 
  ON quality_defects FOR ALL 
  USING (auth.jwt() -> 'app_metadata' ->> 'role' IN ('quality', 'manager', 'admin'));

CREATE POLICY "Quality có thể cập nhật fabric_inventory" 
  ON fabric_inventory FOR UPDATE 
  USING (auth.jwt() -> 'app_metadata' ->> 'role' IN ('quality', 'manager', 'admin'));

-- Chính sách cho vai trò WAREHOUSE (quản lý kho)
CREATE POLICY "Warehouse có thể thêm/sửa/xem fabric_inventory" 
  ON fabric_inventory FOR ALL 
  USING (auth.jwt() -> 'app_metadata' ->> 'role' IN ('warehouse', 'manager', 'admin'));

CREATE POLICY "Warehouse có thể thêm/sửa/xem fabric_issues" 
  ON fabric_issues FOR ALL 
  USING (auth.jwt() -> 'app_metadata' ->> 'role' IN ('warehouse', 'manager', 'admin'));

CREATE POLICY "Warehouse có thể thêm/sửa/xem fabric_issue_items" 
  ON fabric_issue_items FOR ALL 
  USING (auth.jwt() -> 'app_metadata' ->> 'role' IN ('warehouse', 'manager', 'admin'));

CREATE POLICY "Warehouse có thể thêm/sửa/xem inventory_checks" 
  ON inventory_checks FOR ALL 
  USING (auth.jwt() -> 'app_metadata' ->> 'role' IN ('warehouse', 'manager', 'admin'));

CREATE POLICY "Warehouse có thể thêm/sửa/xem inventory_check_items" 
  ON inventory_check_items FOR ALL 
  USING (auth.jwt() -> 'app_metadata' ->> 'role' IN ('warehouse', 'manager', 'admin'));

-- Chính sách cho vai trò PRODUCTION (sản xuất)
CREATE POLICY "Production có thể xem fabrics và inventory" 
  ON fabrics FOR SELECT 
  USING (auth.jwt() -> 'app_metadata' ->> 'role' IN ('production', 'warehouse', 'manager', 'admin'));

CREATE POLICY "Production có thể xem fabric_inventory" 
  ON fabric_inventory FOR SELECT 
  USING (auth.jwt() -> 'app_metadata' ->> 'role' IN ('production', 'warehouse', 'manager', 'admin'));

CREATE POLICY "Production có thể cập nhật cutting_orders" 
  ON cutting_orders FOR UPDATE 
  USING (auth.jwt() -> 'app_metadata' ->> 'role' IN ('production', 'manager', 'admin'));

CREATE POLICY "Production có thể cập nhật cutting_order_details" 
  ON cutting_order_details FOR UPDATE 
  USING (auth.jwt() -> 'app_metadata' ->> 'role' IN ('production', 'manager', 'admin'));

-------------------------------------------------------------------------------
-- FUNCTION-BASED ROW SECURITY
-------------------------------------------------------------------------------

-- Function kiểm tra xem người dùng có quyền trên phòng ban không
CREATE OR REPLACE FUNCTION auth.user_has_department_access(department_id INT)
RETURNS BOOLEAN AS $$
BEGIN
  -- Kiểm tra xem user có thuộc phòng ban này không 
  -- hoặc là admin hoặc manager (có quyền truy cập tất cả)
  RETURN (
    auth.jwt() -> 'app_metadata' ->> 'department_id' = department_id::TEXT
    OR auth.jwt() -> 'app_metadata' ->> 'role' IN ('admin', 'manager')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Áp dụng bảo mật theo phòng ban
CREATE POLICY "Chỉ xem được nhân viên trong phòng ban"
  ON employees FOR SELECT
  USING (
    auth.user_has_department_access(department_id)
  );

-------------------------------------------------------------------------------
-- AUDIT LOGGING
-------------------------------------------------------------------------------

-- Tạo bảng ghi log thay đổi
CREATE TABLE IF NOT EXISTS audit_logs (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  table_name TEXT NOT NULL,
  row_id BIGINT NOT NULL,
  operation TEXT NOT NULL,
  old_data JSONB,
  new_data JSONB,
  changed_by UUID NOT NULL,
  changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Function để ghi log thay đổi
CREATE OR REPLACE FUNCTION log_audit_event()
RETURNS TRIGGER AS $$
DECLARE
  audit_row audit_logs;
  excluded_columns TEXT[] := ARRAY['updated_at', 'created_at'];
BEGIN
  audit_row.changed_by := auth.uid();
  audit_row.table_name := TG_TABLE_NAME;
  
  IF (TG_OP = 'DELETE') THEN
    audit_row.row_id := OLD.id;
    audit_row.operation := 'DELETE';
    audit_row.old_data := to_jsonb(OLD);
    audit_row.new_data := NULL;
  ELSIF (TG_OP = 'UPDATE') THEN
    audit_row.row_id := NEW.id;
    audit_row.operation := 'UPDATE';
    audit_row.old_data := to_jsonb(OLD);
    audit_row.new_data := to_jsonb(NEW);
  ELSIF (TG_OP = 'INSERT') THEN
    audit_row.row_id := NEW.id;
    audit_row.operation := 'INSERT';
    audit_row.old_data := NULL;
    audit_row.new_data := to_jsonb(NEW);
  END IF;

  INSERT INTO audit_logs (
    table_name,
    row_id,
    operation,
    old_data,
    new_data,
    changed_by,
    changed_at
  ) VALUES (
    audit_row.table_name,
    audit_row.row_id,
    audit_row.operation,
    audit_row.old_data,
    audit_row.new_data,
    audit_row.changed_by,
    NOW()
  );

  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Tạo triggers cho các bảng chính
CREATE TRIGGER fabrics_audit
  AFTER INSERT OR UPDATE OR DELETE ON fabrics
  FOR EACH ROW EXECUTE FUNCTION log_audit_event();

CREATE TRIGGER fabric_inventory_audit
  AFTER INSERT OR UPDATE OR DELETE ON fabric_inventory
  FOR EACH ROW EXECUTE FUNCTION log_audit_event();

CREATE TRIGGER cutting_orders_audit
  AFTER INSERT OR UPDATE OR DELETE ON cutting_orders
  FOR EACH ROW EXECUTE FUNCTION log_audit_event();

CREATE TRIGGER fabric_issues_audit
  AFTER INSERT OR UPDATE OR DELETE ON fabric_issues
  FOR EACH ROW EXECUTE FUNCTION log_audit_event();

CREATE TRIGGER inventory_checks_audit
  AFTER INSERT OR UPDATE OR DELETE ON inventory_checks
  FOR EACH ROW EXECUTE FUNCTION log_audit_event();

CREATE TRIGGER quality_control_records_audit
  AFTER INSERT OR UPDATE OR DELETE ON quality_control_records
  FOR EACH ROW EXECUTE FUNCTION log_audit_event(); 