-- Kích hoạt RLS cho tất cả các bảng
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_standards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.production_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.production_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.production_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.production_progress ENABLE ROW LEVEL SECURITY;

-- Policy cho bảng nhà cung cấp
CREATE POLICY "Authenticated users can read suppliers" ON public.suppliers
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert suppliers" ON public.suppliers
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update suppliers" ON public.suppliers
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete suppliers" ON public.suppliers
    FOR DELETE USING (auth.role() = 'authenticated');

-- Policy cho bảng nguyên phụ liệu
CREATE POLICY "Authenticated users can read materials" ON public.materials
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert materials" ON public.materials
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update materials" ON public.materials
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete materials" ON public.materials
    FOR DELETE USING (auth.role() = 'authenticated');

-- Policy cho bảng sản phẩm
CREATE POLICY "Authenticated users can read products" ON public.products
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert products" ON public.products
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update products" ON public.products
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete products" ON public.products
    FOR DELETE USING (auth.role() = 'authenticated');

-- Policy cho bảng định mức sản phẩm
CREATE POLICY "Authenticated users can read product_standards" ON public.product_standards
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert product_standards" ON public.product_standards
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update product_standards" ON public.product_standards
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete product_standards" ON public.product_standards
    FOR DELETE USING (auth.role() = 'authenticated');

-- Bảng phân loại nguyên vật liệu (material_types)
ALTER TABLE public.material_types ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view material types"
  ON public.material_types
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert material types"
  ON public.material_types
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update material types"
  ON public.material_types
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete material types"
  ON public.material_types
  FOR DELETE
  TO authenticated
  USING (true);

-- Bảng thuộc tính tùy chỉnh cho phân loại nguyên vật liệu (material_type_properties)
ALTER TABLE public.material_type_properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view material type properties"
  ON public.material_type_properties
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert material type properties"
  ON public.material_type_properties
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update material type properties"
  ON public.material_type_properties
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete material type properties"
  ON public.material_type_properties
  FOR DELETE
  TO authenticated
  USING (true);

-- Policy cho các bảng khác tương tự...

-- RLS Policies cho hệ thống ERP

-- Bật RLS cho tất cả các bảng
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplier_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplier_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplier_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplier_contract_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.material_types ENABLE ROW LEVEL SECURITY;

-- RLS cho bảng suppliers
CREATE POLICY "Cho phép xem suppliers" ON public.suppliers FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Cho phép thêm suppliers" ON public.suppliers FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Cho phép sửa suppliers" ON public.suppliers FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Cho phép xóa suppliers" ON public.suppliers FOR DELETE USING (auth.role() = 'authenticated');

-- RLS cho bảng supplier_transactions
CREATE POLICY "Cho phép xem supplier_transactions" ON public.supplier_transactions FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Cho phép thêm supplier_transactions" ON public.supplier_transactions FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Cho phép sửa supplier_transactions" ON public.supplier_transactions FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Cho phép xóa supplier_transactions" ON public.supplier_transactions FOR DELETE USING (auth.role() = 'authenticated');

-- RLS cho bảng supplier_ratings
CREATE POLICY "Cho phép xem supplier_ratings" ON public.supplier_ratings FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Cho phép thêm supplier_ratings" ON public.supplier_ratings FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Cho phép sửa supplier_ratings" ON public.supplier_ratings FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Cho phép xóa supplier_ratings" ON public.supplier_ratings FOR DELETE USING (auth.role() = 'authenticated');

-- RLS cho bảng supplier_contracts
CREATE POLICY "Cho phép xem supplier_contracts" ON public.supplier_contracts FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Cho phép thêm supplier_contracts" ON public.supplier_contracts FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Cho phép sửa supplier_contracts" ON public.supplier_contracts FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Cho phép xóa supplier_contracts" ON public.supplier_contracts FOR DELETE USING (auth.role() = 'authenticated');

-- RLS cho bảng supplier_contract_payments
CREATE POLICY "Cho phép xem supplier_contract_payments" ON public.supplier_contract_payments FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Cho phép thêm supplier_contract_payments" ON public.supplier_contract_payments FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Cho phép sửa supplier_contract_payments" ON public.supplier_contract_payments FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Cho phép xóa supplier_contract_payments" ON public.supplier_contract_payments FOR DELETE USING (auth.role() = 'authenticated');

-- RLS cho bảng material_types 