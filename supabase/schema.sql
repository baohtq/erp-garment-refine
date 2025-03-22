-- Bảng nhà cung cấp (suppliers)
CREATE TABLE IF NOT EXISTS public.suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    contact_person TEXT,
    phone TEXT,
    email TEXT,
    address TEXT,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Bảng lịch sử giao dịch với nhà cung cấp (supplier_transactions)
CREATE TABLE IF NOT EXISTS public.supplier_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    supplier_id UUID REFERENCES public.suppliers(id) ON DELETE CASCADE,
    transaction_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
    transaction_type TEXT NOT NULL, -- 'receipt', 'payment', 'return', 'other'
    amount NUMERIC NOT NULL,
    description TEXT,
    document_no TEXT,
    status TEXT DEFAULT 'completed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Bảng đánh giá nhà cung cấp (supplier_ratings)
CREATE TABLE IF NOT EXISTS public.supplier_ratings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    supplier_id UUID REFERENCES public.suppliers(id) ON DELETE CASCADE,
    rating_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
    quality_score INTEGER CHECK (quality_score BETWEEN 1 AND 5),
    delivery_score INTEGER CHECK (delivery_score BETWEEN 1 AND 5),
    price_score INTEGER CHECK (price_score BETWEEN 1 AND 5),
    service_score INTEGER CHECK (service_score BETWEEN 1 AND 5),
    overall_score NUMERIC,
    feedback TEXT,
    rated_by TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Bảng hợp đồng với nhà cung cấp (supplier_contracts)
CREATE TABLE IF NOT EXISTS public.supplier_contracts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    supplier_id UUID REFERENCES public.suppliers(id) ON DELETE CASCADE,
    contract_no TEXT NOT NULL,
    contract_date DATE NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    contract_type TEXT, -- 'longterm', 'project', 'oneshot'
    total_value NUMERIC,
    payment_terms TEXT,
    delivery_terms TEXT,
    status TEXT DEFAULT 'active', -- 'draft', 'active', 'expired', 'terminated'
    file_url TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Bảng thanh toán hợp đồng nhà cung cấp (supplier_contract_payments)
CREATE TABLE IF NOT EXISTS public.supplier_contract_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contract_id UUID REFERENCES public.supplier_contracts(id) ON DELETE CASCADE,
    payment_date DATE NOT NULL,
    amount NUMERIC NOT NULL,
    payment_method TEXT, -- 'bank_transfer', 'cash', 'credit'
    reference_no TEXT,
    status TEXT DEFAULT 'completed', -- 'pending', 'completed', 'cancelled'
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Bảng phân loại nguyên vật liệu (material_types)
CREATE TABLE IF NOT EXISTS public.material_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    parent_id UUID REFERENCES public.material_types(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Bảng thuộc tính tùy chỉnh cho phân loại nguyên vật liệu (material_type_properties)
CREATE TABLE IF NOT EXISTS public.material_type_properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    material_type_id UUID REFERENCES public.material_types(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL, -- 'text', 'number', 'select', 'boolean'
    required BOOLEAN DEFAULT false,
    default_value TEXT,
    options JSONB, -- Lưu các tùy chọn cho kiểu select
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Bảng nguyên phụ liệu (materials)
CREATE TABLE IF NOT EXISTS public.materials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    type_id UUID REFERENCES public.material_types(id), -- Thay đổi từ type TEXT sang type_id UUID
    unit TEXT NOT NULL,
    stock_quantity NUMERIC DEFAULT 0,
    min_quantity NUMERIC DEFAULT 0,
    price NUMERIC DEFAULT 0,
    supplier_id UUID REFERENCES public.suppliers(id),
    status TEXT DEFAULT 'active',
    properties JSONB, -- Lưu các thuộc tính tùy chỉnh theo loại nguyên vật liệu
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Bảng sản phẩm (products)
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT,
    unit_price NUMERIC DEFAULT 0,
    image_url TEXT,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Bảng định mức sản phẩm (product_standards)
CREATE TABLE IF NOT EXISTS public.product_standards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    material_id UUID REFERENCES public.materials(id),
    quantity NUMERIC NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Bảng đơn hàng sản xuất (production_orders)
CREATE TABLE IF NOT EXISTS public.production_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT NOT NULL UNIQUE,
    customer_name TEXT,
    order_date DATE NOT NULL,
    delivery_date DATE,
    status TEXT DEFAULT 'pending',
    total_quantity INTEGER,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Bảng chi tiết đơn hàng sản xuất (production_order_items)
CREATE TABLE IF NOT EXISTS public.production_order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    production_order_id UUID REFERENCES public.production_orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id),
    quantity INTEGER NOT NULL,
    unit_price NUMERIC DEFAULT 0,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Bảng công đoạn sản xuất (production_stages)
CREATE TABLE IF NOT EXISTS public.production_stages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    sequence_number INTEGER,
    standard_time NUMERIC, -- Thời gian tiêu chuẩn (phút)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Bảng nhân viên (employees)
CREATE TABLE IF NOT EXISTS public.employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_code TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    gender TEXT,
    date_of_birth DATE,
    phone TEXT,
    address TEXT,
    position TEXT,
    department TEXT,
    join_date DATE,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Bảng tiến độ sản xuất (production_progress)
CREATE TABLE IF NOT EXISTS public.production_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    production_order_item_id UUID REFERENCES public.production_order_items(id) ON DELETE CASCADE,
    stage_id UUID REFERENCES public.production_stages(id),
    employee_id UUID REFERENCES public.employees(id),
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    quantity_completed INTEGER DEFAULT 0,
    status TEXT DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Website Module Tables

-- Bảng thông tin trang web (website_info)
CREATE TABLE IF NOT EXISTS public.website_info (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name TEXT NOT NULL,
    logo_url TEXT,
    slogan TEXT,
    description TEXT,
    email TEXT,
    phone TEXT,
    address TEXT,
    tax_code TEXT,
    social_media JSONB, -- {facebook: url, linkedin: url, youtube: url}
    meta_description TEXT,
    meta_keywords TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Bảng trang (website_pages)
CREATE TABLE IF NOT EXISTS public.website_pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    content TEXT,
    meta_title TEXT,
    meta_description TEXT,
    is_published BOOLEAN DEFAULT false,
    publish_date TIMESTAMP WITH TIME ZONE,
    sort_order INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Bảng banner (website_banners)
CREATE TABLE IF NOT EXISTS public.website_banners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    image_url TEXT NOT NULL,
    link TEXT,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Bảng bài viết (website_blog_posts)
CREATE TABLE IF NOT EXISTS public.website_blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    content TEXT,
    excerpt TEXT,
    featured_image TEXT,
    author_id UUID REFERENCES auth.users(id),
    status TEXT DEFAULT 'draft', -- 'draft', 'published', 'archived'
    publish_date TIMESTAMP WITH TIME ZONE,
    category_id UUID REFERENCES public.website_blog_categories(id),
    views_count INTEGER DEFAULT 0,
    meta_title TEXT,
    meta_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Bảng danh mục bài viết (website_blog_categories)
CREATE TABLE IF NOT EXISTS public.website_blog_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    parent_id UUID REFERENCES public.website_blog_categories(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Bảng tag bài viết (website_blog_tags)
CREATE TABLE IF NOT EXISTS public.website_blog_tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Bảng liên kết bài viết và tag (website_blog_post_tags)
CREATE TABLE IF NOT EXISTS public.website_blog_post_tags (
    post_id UUID REFERENCES public.website_blog_posts(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES public.website_blog_tags(id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, tag_id)
);

-- Bảng khách hàng tiêu biểu (website_customers)
CREATE TABLE IF NOT EXISTS public.website_customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    logo_url TEXT,
    description TEXT,
    url TEXT,
    display_order INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Bảng đánh giá và phản hồi khách hàng (website_testimonials)
CREATE TABLE IF NOT EXISTS public.website_testimonials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_name TEXT NOT NULL,
    customer_position TEXT,
    customer_company TEXT,
    content TEXT NOT NULL,
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Bảng yêu cầu liên hệ (website_contact_requests)
CREATE TABLE IF NOT EXISTS public.website_contact_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new', -- 'new', 'in_progress', 'responded', 'closed'
    response TEXT,
    responded_by UUID REFERENCES auth.users(id),
    responded_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Bảng vị trí tuyển dụng (website_job_positions)
CREATE TABLE IF NOT EXISTS public.website_job_positions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    department TEXT,
    location TEXT,
    job_type TEXT, -- 'full_time', 'part_time', 'contract', 'internship'
    description TEXT,
    requirements TEXT,
    benefits TEXT,
    salary_range TEXT,
    is_active BOOLEAN DEFAULT true,
    application_deadline DATE,
    publish_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Bảng đơn ứng tuyển (website_job_applications)
CREATE TABLE IF NOT EXISTS public.website_job_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_position_id UUID REFERENCES public.website_job_positions(id) ON DELETE CASCADE,
    applicant_name TEXT NOT NULL,
    applicant_email TEXT NOT NULL,
    applicant_phone TEXT,
    resume_url TEXT,
    cover_letter TEXT,
    status TEXT DEFAULT 'received', -- 'received', 'reviewing', 'interview', 'rejected', 'accepted'
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Fix foreign key reference (website_blog_posts references website_blog_categories)
-- Need to recreate website_blog_categories before website_blog_posts
DROP TABLE IF EXISTS public.website_blog_post_tags;
DROP TABLE IF EXISTS public.website_blog_posts;
DROP TABLE IF EXISTS public.website_blog_categories;

-- Recreate in correct order
CREATE TABLE IF NOT EXISTS public.website_blog_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    parent_id UUID REFERENCES public.website_blog_categories(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.website_blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    content TEXT,
    excerpt TEXT,
    featured_image TEXT,
    author_id UUID REFERENCES auth.users(id),
    status TEXT DEFAULT 'draft', -- 'draft', 'published', 'archived'
    publish_date TIMESTAMP WITH TIME ZONE,
    category_id UUID REFERENCES public.website_blog_categories(id),
    views_count INTEGER DEFAULT 0,
    meta_title TEXT,
    meta_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.website_blog_post_tags (
    post_id UUID REFERENCES public.website_blog_posts(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES public.website_blog_tags(id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, tag_id)
); 