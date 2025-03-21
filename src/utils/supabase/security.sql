-- Row Level Security (RLS) cho hệ thống erp-garment
-- File này chứa các RLS policies để bảo vệ dữ liệu trên Supabase

---------------------------------------------------------------------------
-- ENABLE RLS ON TABLES
---------------------------------------------------------------------------

-- Bật RLS trên các bảng chính
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE fabrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE fabric_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE cutting_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE fabric_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE fabric_issue_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_check_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE quality_control_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE quality_defects ENABLE ROW LEVEL SECURITY;
ALTER TABLE warehouses ENABLE ROW LEVEL SECURITY;

---------------------------------------------------------------------------
-- CREATE USER ROLE FUNCTION
---------------------------------------------------------------------------

-- Hàm truy vấn vai trò của user hiện tại
CREATE OR REPLACE FUNCTION get_current_user_role()
RETURNS TEXT AS $$
  SELECT
    COALESCE(
      (
        SELECT role
        FROM user_profiles
        WHERE auth.uid() = id
      ),
      'guest'
    )
$$ LANGUAGE SQL SECURITY DEFINER;

---------------------------------------------------------------------------
-- DEFAULT POLICIES
---------------------------------------------------------------------------

-- Chính sách mặc định: Chỉ authenticated users có thể xem dữ liệu
CREATE POLICY "Authenticated users can view" ON suppliers
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can view" ON fabrics
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can view" ON fabric_inventory
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can view" ON cutting_orders
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can view" ON fabric_issues
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can view" ON fabric_issue_items
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can view" ON inventory_checks
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can view" ON inventory_check_items
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can view" ON quality_control_records
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can view" ON quality_defects
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can view" ON warehouses
  FOR SELECT
  TO authenticated
  USING (true);

---------------------------------------------------------------------------
-- ROLE-BASED POLICIES FOR SUPPLIERS
---------------------------------------------------------------------------

-- Admin và inventory_manager có thể thêm/sửa/xóa nhà cung cấp
CREATE POLICY "Only admin and inventory_manager can insert" ON suppliers
  FOR INSERT
  TO authenticated
  WITH CHECK (get_current_user_role() IN ('admin', 'inventory_manager'));

CREATE POLICY "Only admin and inventory_manager can update" ON suppliers
  FOR UPDATE
  TO authenticated
  USING (get_current_user_role() IN ('admin', 'inventory_manager'))
  WITH CHECK (get_current_user_role() IN ('admin', 'inventory_manager'));

CREATE POLICY "Only admin and inventory_manager can delete" ON suppliers
  FOR DELETE
  TO authenticated
  USING (get_current_user_role() IN ('admin', 'inventory_manager'));

---------------------------------------------------------------------------
-- ROLE-BASED POLICIES FOR FABRICS
---------------------------------------------------------------------------

-- Admin, inventory_manager, fabric_manager có thể thêm/sửa/xóa vải
CREATE POLICY "Only admin, inventory_manager, fabric_manager can insert" ON fabrics
  FOR INSERT
  TO authenticated
  WITH CHECK (get_current_user_role() IN ('admin', 'inventory_manager', 'fabric_manager'));

CREATE POLICY "Only admin, inventory_manager, fabric_manager can update" ON fabrics
  FOR UPDATE
  TO authenticated
  USING (get_current_user_role() IN ('admin', 'inventory_manager', 'fabric_manager'))
  WITH CHECK (get_current_user_role() IN ('admin', 'inventory_manager', 'fabric_manager'));

CREATE POLICY "Only admin and inventory_manager can delete" ON fabrics
  FOR DELETE
  TO authenticated
  USING (get_current_user_role() IN ('admin', 'inventory_manager'));

---------------------------------------------------------------------------
-- ROLE-BASED POLICIES FOR FABRIC_INVENTORY
---------------------------------------------------------------------------

-- Admin, inventory_manager, fabric_manager, warehouse_staff có thể thêm cuộn vải
CREATE POLICY "Only admin, inventory_manager, fabric_manager, warehouse_staff can insert" ON fabric_inventory
  FOR INSERT
  TO authenticated
  WITH CHECK (get_current_user_role() IN ('admin', 'inventory_manager', 'fabric_manager', 'warehouse_staff'));

-- Admin, inventory_manager, fabric_manager, warehouse_staff có thể cập nhật cuộn vải
CREATE POLICY "Only admin, inventory_manager, fabric_manager, warehouse_staff can update" ON fabric_inventory
  FOR UPDATE
  TO authenticated
  USING (get_current_user_role() IN ('admin', 'inventory_manager', 'fabric_manager', 'warehouse_staff'))
  WITH CHECK (get_current_user_role() IN ('admin', 'inventory_manager', 'fabric_manager', 'warehouse_staff'));

-- Chỉ admin và inventory_manager có thể xóa cuộn vải
CREATE POLICY "Only admin and inventory_manager can delete" ON fabric_inventory
  FOR DELETE
  TO authenticated
  USING (get_current_user_role() IN ('admin', 'inventory_manager'));

---------------------------------------------------------------------------
-- ROLE-BASED POLICIES FOR CUTTING_ORDERS
---------------------------------------------------------------------------

-- Admin, production_manager, cutting_manager có thể thêm lệnh cắt
CREATE POLICY "Only admin, production_manager, cutting_manager can insert" ON cutting_orders
  FOR INSERT
  TO authenticated
  WITH CHECK (get_current_user_role() IN ('admin', 'production_manager', 'cutting_manager'));

-- Admin, production_manager, cutting_manager có thể cập nhật lệnh cắt
CREATE POLICY "Only admin, production_manager, cutting_manager can update" ON cutting_orders
  FOR UPDATE
  TO authenticated
  USING (get_current_user_role() IN ('admin', 'production_manager', 'cutting_manager'))
  WITH CHECK (get_current_user_role() IN ('admin', 'production_manager', 'cutting_manager'));

-- Chỉ admin và production_manager có thể xóa lệnh cắt
CREATE POLICY "Only admin and production_manager can delete" ON cutting_orders
  FOR DELETE
  TO authenticated
  USING (get_current_user_role() IN ('admin', 'production_manager'));

---------------------------------------------------------------------------
-- ROLE-BASED POLICIES FOR FABRIC_ISSUES
---------------------------------------------------------------------------

-- Admin, inventory_manager, warehouse_staff có thể tạo phiếu xuất vải
CREATE POLICY "Only admin, inventory_manager, warehouse_staff can insert" ON fabric_issues
  FOR INSERT
  TO authenticated
  WITH CHECK (get_current_user_role() IN ('admin', 'inventory_manager', 'warehouse_staff'));

-- Admin, inventory_manager, warehouse_staff có thể cập nhật phiếu xuất vải
CREATE POLICY "Only admin, inventory_manager, warehouse_staff can update" ON fabric_issues
  FOR UPDATE
  TO authenticated
  USING (get_current_user_role() IN ('admin', 'inventory_manager', 'warehouse_staff'))
  WITH CHECK (get_current_user_role() IN ('admin', 'inventory_manager', 'warehouse_staff'));

-- Chỉ admin và inventory_manager có thể xóa phiếu xuất vải
CREATE POLICY "Only admin and inventory_manager can delete" ON fabric_issues
  FOR DELETE
  TO authenticated
  USING (get_current_user_role() IN ('admin', 'inventory_manager'));

---------------------------------------------------------------------------
-- ROLE-BASED POLICIES FOR FABRIC_ISSUE_ITEMS
---------------------------------------------------------------------------

-- Admin, inventory_manager, warehouse_staff có thể thêm/sửa/xóa các mục phiếu xuất vải
CREATE POLICY "Only admin, inventory_manager, warehouse_staff can insert" ON fabric_issue_items
  FOR INSERT
  TO authenticated
  WITH CHECK (get_current_user_role() IN ('admin', 'inventory_manager', 'warehouse_staff'));

CREATE POLICY "Only admin, inventory_manager, warehouse_staff can update" ON fabric_issue_items
  FOR UPDATE
  TO authenticated
  USING (get_current_user_role() IN ('admin', 'inventory_manager', 'warehouse_staff'))
  WITH CHECK (get_current_user_role() IN ('admin', 'inventory_manager', 'warehouse_staff'));

CREATE POLICY "Only admin and inventory_manager can delete" ON fabric_issue_items
  FOR DELETE
  TO authenticated
  USING (get_current_user_role() IN ('admin', 'inventory_manager'));

---------------------------------------------------------------------------
-- ROLE-BASED POLICIES FOR INVENTORY_CHECKS
---------------------------------------------------------------------------

-- Admin, inventory_manager, warehouse_staff có thể tạo phiếu kiểm kê
CREATE POLICY "Only admin, inventory_manager, warehouse_staff can insert" ON inventory_checks
  FOR INSERT
  TO authenticated
  WITH CHECK (get_current_user_role() IN ('admin', 'inventory_manager', 'warehouse_staff'));

-- Admin, inventory_manager, warehouse_staff có thể cập nhật phiếu kiểm kê
CREATE POLICY "Only admin, inventory_manager, warehouse_staff can update" ON inventory_checks
  FOR UPDATE
  TO authenticated
  USING (get_current_user_role() IN ('admin', 'inventory_manager', 'warehouse_staff'))
  WITH CHECK (get_current_user_role() IN ('admin', 'inventory_manager', 'warehouse_staff'));

-- Chỉ admin và inventory_manager có thể xóa phiếu kiểm kê
CREATE POLICY "Only admin and inventory_manager can delete" ON inventory_checks
  FOR DELETE
  TO authenticated
  USING (get_current_user_role() IN ('admin', 'inventory_manager'));

---------------------------------------------------------------------------
-- ROLE-BASED POLICIES FOR INVENTORY_CHECK_ITEMS
---------------------------------------------------------------------------

-- Admin, inventory_manager, warehouse_staff có thể thêm/sửa/xóa các mục kiểm kê
CREATE POLICY "Only admin, inventory_manager, warehouse_staff can insert" ON inventory_check_items
  FOR INSERT
  TO authenticated
  WITH CHECK (get_current_user_role() IN ('admin', 'inventory_manager', 'warehouse_staff'));

CREATE POLICY "Only admin, inventory_manager, warehouse_staff can update" ON inventory_check_items
  FOR UPDATE
  TO authenticated
  USING (get_current_user_role() IN ('admin', 'inventory_manager', 'warehouse_staff'))
  WITH CHECK (get_current_user_role() IN ('admin', 'inventory_manager', 'warehouse_staff'));

CREATE POLICY "Only admin and inventory_manager can delete" ON inventory_check_items
  FOR DELETE
  TO authenticated
  USING (get_current_user_role() IN ('admin', 'inventory_manager'));

---------------------------------------------------------------------------
-- ROLE-BASED POLICIES FOR QUALITY_CONTROL
---------------------------------------------------------------------------

-- Admin, quality_manager, fabric_manager có thể tạo báo cáo chất lượng
CREATE POLICY "Only admin, quality_manager, fabric_manager can insert" ON quality_control_records
  FOR INSERT
  TO authenticated
  WITH CHECK (get_current_user_role() IN ('admin', 'quality_manager', 'fabric_manager'));

-- Admin, quality_manager, fabric_manager có thể cập nhật báo cáo chất lượng
CREATE POLICY "Only admin, quality_manager, fabric_manager can update" ON quality_control_records
  FOR UPDATE
  TO authenticated
  USING (get_current_user_role() IN ('admin', 'quality_manager', 'fabric_manager'))
  WITH CHECK (get_current_user_role() IN ('admin', 'quality_manager', 'fabric_manager'));

-- Chỉ admin và quality_manager có thể xóa báo cáo chất lượng
CREATE POLICY "Only admin and quality_manager can delete" ON quality_control_records
  FOR DELETE
  TO authenticated
  USING (get_current_user_role() IN ('admin', 'quality_manager'));

-- Tương tự cho bảng quality_defects
CREATE POLICY "Only admin, quality_manager, fabric_manager can insert" ON quality_defects
  FOR INSERT
  TO authenticated
  WITH CHECK (get_current_user_role() IN ('admin', 'quality_manager', 'fabric_manager'));

CREATE POLICY "Only admin, quality_manager, fabric_manager can update" ON quality_defects
  FOR UPDATE
  TO authenticated
  USING (get_current_user_role() IN ('admin', 'quality_manager', 'fabric_manager'))
  WITH CHECK (get_current_user_role() IN ('admin', 'quality_manager', 'fabric_manager'));

CREATE POLICY "Only admin and quality_manager can delete" ON quality_defects
  FOR DELETE
  TO authenticated
  USING (get_current_user_role() IN ('admin', 'quality_manager'));

---------------------------------------------------------------------------
-- ROLE-BASED POLICIES FOR WAREHOUSES
---------------------------------------------------------------------------

-- Chỉ admin có thể thêm/sửa/xóa kho
CREATE POLICY "Only admin can insert" ON warehouses
  FOR INSERT
  TO authenticated
  WITH CHECK (get_current_user_role() = 'admin');

CREATE POLICY "Only admin can update" ON warehouses
  FOR UPDATE
  TO authenticated
  USING (get_current_user_role() = 'admin')
  WITH CHECK (get_current_user_role() = 'admin');

CREATE POLICY "Only admin can delete" ON warehouses
  FOR DELETE
  TO authenticated
  USING (get_current_user_role() = 'admin'); 