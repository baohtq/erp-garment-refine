-- Row Level Security (RLS) Policies
-- Chính sách này sẽ quản lý quyền truy cập dữ liệu cho từng vai trò người dùng

-- Tạo vai trò người dùng
CREATE TYPE user_role AS ENUM ('admin', 'manager', 'production', 'warehouse', 'hr', 'quality');

-- Tạo bảng phân quyền người dùng
CREATE TABLE IF NOT EXISTS user_roles (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    role user_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tạo function để kiểm tra vai trò người dùng
CREATE OR REPLACE FUNCTION public.user_has_role(requested_role user_role)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid() AND role = requested_role
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Policy cho bảng suppliers
CREATE POLICY suppliers_select ON suppliers
    FOR SELECT USING (
        user_has_role('admin') OR 
        user_has_role('manager') OR 
        user_has_role('warehouse')
    );

CREATE POLICY suppliers_insert ON suppliers
    FOR INSERT WITH CHECK (
        user_has_role('admin') OR 
        user_has_role('manager')
    );

CREATE POLICY suppliers_update ON suppliers
    FOR UPDATE USING (
        user_has_role('admin') OR 
        user_has_role('manager')
    );

CREATE POLICY suppliers_delete ON suppliers
    FOR DELETE USING (
        user_has_role('admin')
    );

-- Policy cho bảng employees
CREATE POLICY employees_select ON employees
    FOR SELECT USING (
        user_has_role('admin') OR 
        user_has_role('manager') OR 
        user_has_role('hr')
    );

CREATE POLICY employees_insert ON employees
    FOR INSERT WITH CHECK (
        user_has_role('admin') OR 
        user_has_role('hr')
    );

CREATE POLICY employees_update ON employees
    FOR UPDATE USING (
        user_has_role('admin') OR 
        user_has_role('hr')
    );

CREATE POLICY employees_delete ON employees
    FOR DELETE USING (
        user_has_role('admin')
    );

-- Policy cho bảng materials
CREATE POLICY materials_select ON materials
    FOR SELECT USING (true);

CREATE POLICY materials_insert ON materials
    FOR INSERT WITH CHECK (
        user_has_role('admin') OR 
        user_has_role('warehouse')
    );

CREATE POLICY materials_update ON materials
    FOR UPDATE USING (
        user_has_role('admin') OR 
        user_has_role('warehouse')
    );

CREATE POLICY materials_delete ON materials
    FOR DELETE USING (
        user_has_role('admin')
    );

-- Policy cho bảng products
CREATE POLICY products_select ON products
    FOR SELECT USING (true);

CREATE POLICY products_insert ON products
    FOR INSERT WITH CHECK (
        user_has_role('admin') OR 
        user_has_role('manager')
    );

CREATE POLICY products_update ON products
    FOR UPDATE USING (
        user_has_role('admin') OR 
        user_has_role('manager')
    );

CREATE POLICY products_delete ON products
    FOR DELETE USING (
        user_has_role('admin')
    );

-- Policy cho bảng product_standards
CREATE POLICY product_standards_select ON product_standards
    FOR SELECT USING (true);

CREATE POLICY product_standards_insert ON product_standards
    FOR INSERT WITH CHECK (
        user_has_role('admin') OR 
        user_has_role('manager')
    );

CREATE POLICY product_standards_update ON product_standards
    FOR UPDATE USING (
        user_has_role('admin') OR 
        user_has_role('manager')
    );

CREATE POLICY product_standards_delete ON product_standards
    FOR DELETE USING (
        user_has_role('admin')
    );

-- Policy cho bảng production_orders
CREATE POLICY production_orders_select ON production_orders
    FOR SELECT USING (true);

CREATE POLICY production_orders_insert ON production_orders
    FOR INSERT WITH CHECK (
        user_has_role('admin') OR 
        user_has_role('manager')
    );

CREATE POLICY production_orders_update ON production_orders
    FOR UPDATE USING (
        user_has_role('admin') OR 
        user_has_role('manager') OR
        user_has_role('production')
    );

CREATE POLICY production_orders_delete ON production_orders
    FOR DELETE USING (
        user_has_role('admin')
    );

-- Policy cho bảng production_stages
CREATE POLICY production_stages_select ON production_stages
    FOR SELECT USING (true);

CREATE POLICY production_stages_insert ON production_stages
    FOR INSERT WITH CHECK (
        user_has_role('admin') OR 
        user_has_role('manager')
    );

CREATE POLICY production_stages_update ON production_stages
    FOR UPDATE USING (
        user_has_role('admin') OR 
        user_has_role('manager')
    );

CREATE POLICY production_stages_delete ON production_stages
    FOR DELETE USING (
        user_has_role('admin')
    );

-- Policy cho bảng production_progress
CREATE POLICY production_progress_select ON production_progress
    FOR SELECT USING (true);

CREATE POLICY production_progress_insert ON production_progress
    FOR INSERT WITH CHECK (
        user_has_role('admin') OR 
        user_has_role('manager') OR
        user_has_role('production')
    );

CREATE POLICY production_progress_update ON production_progress
    FOR UPDATE USING (
        user_has_role('admin') OR 
        user_has_role('manager') OR
        user_has_role('production')
    );

CREATE POLICY production_progress_delete ON production_progress
    FOR DELETE USING (
        user_has_role('admin')
    );

-- Policy cho bảng finished_products
CREATE POLICY finished_products_select ON finished_products
    FOR SELECT USING (true);

CREATE POLICY finished_products_insert ON finished_products
    FOR INSERT WITH CHECK (
        user_has_role('admin') OR 
        user_has_role('production') OR
        user_has_role('quality')
    );

CREATE POLICY finished_products_update ON finished_products
    FOR UPDATE USING (
        user_has_role('admin') OR 
        user_has_role('quality') OR
        user_has_role('warehouse')
    );

CREATE POLICY finished_products_delete ON finished_products
    FOR DELETE USING (
        user_has_role('admin')
    );

-- Policy cho các bảng khác (material_receipts, material_issues, ...)
-- Thiết lập tương tự 