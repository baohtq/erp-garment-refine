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

-- Website Module RLS Policies

-- Enable RLS
ALTER TABLE public.website_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_blog_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_blog_post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_contact_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_job_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_job_applications ENABLE ROW LEVEL SECURITY;

-- website_info RLS policies
CREATE POLICY "Allow read access to website_info for all" 
ON public.website_info FOR SELECT USING (true);

CREATE POLICY "Allow insert, update, delete access to website_info for admins" 
ON public.website_info FOR ALL USING (
  auth.uid() IN (SELECT id FROM auth.users WHERE role = 'admin')
);

-- website_pages RLS policies
CREATE POLICY "Allow read access to published website_pages for all" 
ON public.website_pages FOR SELECT USING (is_published = true);

CREATE POLICY "Allow read access to all website_pages for admins" 
ON public.website_pages FOR SELECT USING (
  auth.uid() IN (SELECT id FROM auth.users WHERE role = 'admin')
);

CREATE POLICY "Allow insert, update, delete access to website_pages for admins" 
ON public.website_pages FOR ALL USING (
  auth.uid() IN (SELECT id FROM auth.users WHERE role = 'admin')
);

-- website_banners RLS policies
CREATE POLICY "Allow read access to active website_banners for all" 
ON public.website_banners FOR SELECT USING (
  is_active = true AND 
  (start_date IS NULL OR start_date <= now()) AND 
  (end_date IS NULL OR end_date >= now())
);

CREATE POLICY "Allow read access to all website_banners for admins" 
ON public.website_banners FOR SELECT USING (
  auth.uid() IN (SELECT id FROM auth.users WHERE role = 'admin')
);

CREATE POLICY "Allow insert, update, delete access to website_banners for admins" 
ON public.website_banners FOR ALL USING (
  auth.uid() IN (SELECT id FROM auth.users WHERE role = 'admin')
);

-- website_blog_categories RLS policies
CREATE POLICY "Allow read access to website_blog_categories for all" 
ON public.website_blog_categories FOR SELECT USING (true);

CREATE POLICY "Allow insert, update, delete access to website_blog_categories for admins" 
ON public.website_blog_categories FOR ALL USING (
  auth.uid() IN (SELECT id FROM auth.users WHERE role = 'admin')
);

-- website_blog_posts RLS policies
CREATE POLICY "Allow read access to published website_blog_posts for all" 
ON public.website_blog_posts FOR SELECT USING (
  status = 'published' AND 
  publish_date <= now()
);

CREATE POLICY "Allow read access to all website_blog_posts for admins" 
ON public.website_blog_posts FOR SELECT USING (
  auth.uid() IN (SELECT id FROM auth.users WHERE role = 'admin')
);

CREATE POLICY "Allow insert, update, delete access to website_blog_posts for admins and authors" 
ON public.website_blog_posts FOR ALL USING (
  auth.uid() IN (SELECT id FROM auth.users WHERE role = 'admin') OR
  auth.uid() = author_id
);

-- website_blog_tags RLS policies
CREATE POLICY "Allow read access to website_blog_tags for all" 
ON public.website_blog_tags FOR SELECT USING (true);

CREATE POLICY "Allow insert, update, delete access to website_blog_tags for admins" 
ON public.website_blog_tags FOR ALL USING (
  auth.uid() IN (SELECT id FROM auth.users WHERE role = 'admin')
);

-- website_blog_post_tags RLS policies
CREATE POLICY "Allow read access to website_blog_post_tags for all" 
ON public.website_blog_post_tags FOR SELECT USING (true);

CREATE POLICY "Allow insert, update, delete access to website_blog_post_tags for admins and post authors" 
ON public.website_blog_post_tags FOR ALL USING (
  auth.uid() IN (SELECT id FROM auth.users WHERE role = 'admin') OR
  EXISTS (
    SELECT 1 FROM public.website_blog_posts
    WHERE id = post_id AND author_id = auth.uid()
  )
);

-- website_customers RLS policies
CREATE POLICY "Allow read access to active website_customers for all" 
ON public.website_customers FOR SELECT USING (is_active = true);

CREATE POLICY "Allow read access to all website_customers for admins" 
ON public.website_customers FOR SELECT USING (
  auth.uid() IN (SELECT id FROM auth.users WHERE role = 'admin')
);

CREATE POLICY "Allow insert, update, delete access to website_customers for admins" 
ON public.website_customers FOR ALL USING (
  auth.uid() IN (SELECT id FROM auth.users WHERE role = 'admin')
);

-- website_testimonials RLS policies
CREATE POLICY "Allow read access to active website_testimonials for all" 
ON public.website_testimonials FOR SELECT USING (is_active = true);

CREATE POLICY "Allow read access to all website_testimonials for admins" 
ON public.website_testimonials FOR SELECT USING (
  auth.uid() IN (SELECT id FROM auth.users WHERE role = 'admin')
);

CREATE POLICY "Allow insert, update, delete access to website_testimonials for admins" 
ON public.website_testimonials FOR ALL USING (
  auth.uid() IN (SELECT id FROM auth.users WHERE role = 'admin')
);

-- website_contact_requests RLS policies
CREATE POLICY "Allow insert access to website_contact_requests for all" 
ON public.website_contact_requests FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow read, update, delete access to website_contact_requests for admins" 
ON public.website_contact_requests FOR ALL USING (
  auth.uid() IN (SELECT id FROM auth.users WHERE role = 'admin')
);

-- website_job_positions RLS policies
CREATE POLICY "Allow read access to active website_job_positions for all" 
ON public.website_job_positions FOR SELECT USING (
  is_active = true AND 
  publish_date <= now() AND
  (application_deadline IS NULL OR application_deadline >= CURRENT_DATE)
);

CREATE POLICY "Allow read access to all website_job_positions for admins" 
ON public.website_job_positions FOR SELECT USING (
  auth.uid() IN (SELECT id FROM auth.users WHERE role = 'admin')
);

CREATE POLICY "Allow insert, update, delete access to website_job_positions for admins" 
ON public.website_job_positions FOR ALL USING (
  auth.uid() IN (SELECT id FROM auth.users WHERE role = 'admin')
);

-- website_job_applications RLS policies
CREATE POLICY "Allow insert access to website_job_applications for all" 
ON public.website_job_applications FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow read, update, delete access to website_job_applications for admins" 
ON public.website_job_applications FOR ALL USING (
  auth.uid() IN (SELECT id FROM auth.users WHERE role = 'admin')
); 