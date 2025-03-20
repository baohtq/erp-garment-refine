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