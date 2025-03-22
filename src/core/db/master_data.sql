-- Khởi tạo cơ sở dữ liệu cho ERP quản lý sản xuất may mặc

-- Bảng quản lý nhà cung cấp
CREATE TABLE IF NOT EXISTS suppliers (
  id SERIAL PRIMARY KEY,
  code VARCHAR(20) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  address TEXT,
  phone VARCHAR(20),
  email VARCHAR(100),
  contact_person VARCHAR(100),
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bảng quản lý nhân viên
CREATE TABLE IF NOT EXISTS employees (
  id SERIAL PRIMARY KEY,
  code VARCHAR(20) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  department VARCHAR(50),
  position VARCHAR(50),
  phone VARCHAR(20),
  email VARCHAR(100),
  hire_date DATE,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bảng quản lý nguyên phụ liệu
CREATE TABLE IF NOT EXISTS materials (
  id SERIAL PRIMARY KEY,
  code VARCHAR(20) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  unit VARCHAR(20) NOT NULL,
  current_stock DECIMAL(12,2) DEFAULT 0,
  min_stock DECIMAL(12,2) DEFAULT 0,
  supplier_id INTEGER REFERENCES suppliers(id),
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bảng quản lý sản phẩm
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  code VARCHAR(20) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  category VARCHAR(50),
  unit VARCHAR(20) NOT NULL,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bảng định mức nguyên vật liệu cho từng sản phẩm
CREATE TABLE IF NOT EXISTS product_standards (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id),
  material_id INTEGER REFERENCES materials(id),
  quantity DECIMAL(12,2) NOT NULL,
  unit VARCHAR(20) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id, material_id)
);

-- Bảng quản lý đơn hàng sản xuất
CREATE TABLE IF NOT EXISTS production_orders (
  id SERIAL PRIMARY KEY,
  order_no VARCHAR(20) NOT NULL UNIQUE,
  product_id INTEGER REFERENCES products(id),
  quantity DECIMAL(12,2) NOT NULL,
  start_date DATE,
  end_date DATE,
  status VARCHAR(20) DEFAULT 'pending',
  priority VARCHAR(20) DEFAULT 'normal',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bảng quản lý công đoạn sản xuất
CREATE TABLE IF NOT EXISTS production_stages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  sequence INTEGER NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bảng theo dõi tiến độ sản xuất qua các công đoạn
CREATE TABLE IF NOT EXISTS production_progress (
  id SERIAL PRIMARY KEY,
  production_order_id INTEGER REFERENCES production_orders(id),
  stage_id INTEGER REFERENCES production_stages(id),
  employee_id INTEGER REFERENCES employees(id),
  planned_start_date DATE,
  planned_end_date DATE,
  actual_start_date DATE,
  actual_end_date DATE,
  planned_quantity DECIMAL(12,2),
  completed_quantity DECIMAL(12,2) DEFAULT 0,
  defect_quantity DECIMAL(12,2) DEFAULT 0,
  status VARCHAR(20) DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bảng quản lý sản phẩm hoàn thành
CREATE TABLE IF NOT EXISTS finished_products (
  id SERIAL PRIMARY KEY,
  production_order_id INTEGER REFERENCES production_orders(id),
  product_id INTEGER REFERENCES products(id),
  quantity DECIMAL(12,2) NOT NULL,
  quality_check_status VARCHAR(20) DEFAULT 'pending',
  warehouse_status VARCHAR(20) DEFAULT 'pending',
  inspector_id INTEGER REFERENCES employees(id),
  inspection_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bảng quản lý nhập kho nguyên phụ liệu
CREATE TABLE IF NOT EXISTS material_receipts (
  id SERIAL PRIMARY KEY,
  receipt_no VARCHAR(20) NOT NULL UNIQUE,
  supplier_id INTEGER REFERENCES suppliers(id),
  receive_date DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bảng chi tiết nhập kho nguyên phụ liệu
CREATE TABLE IF NOT EXISTS material_receipt_items (
  id SERIAL PRIMARY KEY,
  material_receipt_id INTEGER REFERENCES material_receipts(id),
  material_id INTEGER REFERENCES materials(id),
  quantity DECIMAL(12,2) NOT NULL,
  unit_price DECIMAL(12,2),
  received_quantity DECIMAL(12,2) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bảng quản lý xuất kho nguyên phụ liệu cho sản xuất
CREATE TABLE IF NOT EXISTS material_issues (
  id SERIAL PRIMARY KEY,
  issue_no VARCHAR(20) NOT NULL UNIQUE,
  production_order_id INTEGER REFERENCES production_orders(id),
  issue_date DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  issued_by INTEGER REFERENCES employees(id),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bảng chi tiết xuất kho nguyên phụ liệu
CREATE TABLE IF NOT EXISTS material_issue_items (
  id SERIAL PRIMARY KEY,
  material_issue_id INTEGER REFERENCES material_issues(id),
  material_id INTEGER REFERENCES materials(id),
  planned_quantity DECIMAL(12,2) NOT NULL,
  issued_quantity DECIMAL(12,2) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bảng thống kê năng suất nhân viên
CREATE TABLE IF NOT EXISTS employee_productivity (
  id SERIAL PRIMARY KEY,
  employee_id INTEGER REFERENCES employees(id),
  production_progress_id INTEGER REFERENCES production_progress(id),
  date DATE NOT NULL,
  working_hours DECIMAL(5,2) NOT NULL,
  quantity_produced DECIMAL(12,2) NOT NULL,
  efficiency DECIMAL(5,2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bảng quản lý vải
CREATE TABLE IF NOT EXISTS fabric_materials (
  id SERIAL PRIMARY KEY,
  code VARCHAR(20) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  width DECIMAL(8,2), -- Khổ vải (cm)
  weight DECIMAL(8,2), -- Định lượng (g/m²)
  color VARCHAR(50),
  pattern VARCHAR(100),
  composition TEXT,
  supplier_id INTEGER REFERENCES suppliers(id),
  unit VARCHAR(20) NOT NULL,
  price DECIMAL(12,2),
  min_stock DECIMAL(12,2) DEFAULT 0,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bảng kho vải
CREATE TABLE IF NOT EXISTS fabric_inventory (
  id SERIAL PRIMARY KEY,
  fabric_id INTEGER REFERENCES fabric_materials(id),
  lot_number VARCHAR(50),
  roll_id VARCHAR(50), -- Mã cây/cuộn vải
  length DECIMAL(12,2), -- Chiều dài (m/yard)
  width DECIMAL(8,2), -- Khổ vải thực tế (cm)
  weight DECIMAL(8,2), -- Trọng lượng (kg)
  defect_notes TEXT,
  quality_grade VARCHAR(10), -- Phân loại chất lượng (A, B, C)
  location VARCHAR(50), -- Vị trí trong kho
  status VARCHAR(20) DEFAULT 'available', -- available, reserved, used
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bảng lệnh cắt
CREATE TABLE IF NOT EXISTS cutting_orders (
  id SERIAL PRIMARY KEY,
  order_no VARCHAR(20) NOT NULL UNIQUE,
  production_order_id INTEGER REFERENCES production_orders(id),
  planned_start_date DATE,
  planned_end_date DATE,
  actual_start_date DATE,
  actual_end_date DATE,
  status VARCHAR(20) DEFAULT 'pending',
  notes TEXT,
  created_by INTEGER REFERENCES employees(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bảng chi tiết lệnh cắt
CREATE TABLE IF NOT EXISTS cutting_order_details (
  id SERIAL PRIMARY KEY,
  cutting_order_id INTEGER REFERENCES cutting_orders(id),
  style_id INTEGER REFERENCES products(id),
  size VARCHAR(20),
  color VARCHAR(50),
  quantity INTEGER NOT NULL,
  fabric_consumption DECIMAL(12,2), -- Định mức vải (m/yard)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bảng tác nghiệp cắt
CREATE TABLE IF NOT EXISTS cutting_operations (
  id SERIAL PRIMARY KEY,
  cutting_order_id INTEGER REFERENCES cutting_orders(id),
  fabric_inventory_id INTEGER REFERENCES fabric_inventory(id),
  used_length DECIMAL(12,2), -- Chiều dài đã sử dụng
  used_weight DECIMAL(8,2), -- Trọng lượng đã sử dụng
  operation_date DATE,
  operator_id INTEGER REFERENCES employees(id),
  wastage DECIMAL(8,2), -- Lượng vải hao hụt
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Schema Version để quản lý migration
CREATE TABLE IF NOT EXISTS schema_version (
  id SERIAL PRIMARY KEY,
  version VARCHAR(50) NOT NULL,
  description TEXT,
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (Row Level Security) Policies
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_standards ENABLE ROW LEVEL SECURITY;
ALTER TABLE production_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE production_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE production_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE finished_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE material_receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE material_receipt_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE material_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE material_issue_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_productivity ENABLE ROW LEVEL SECURITY;
ALTER TABLE fabric_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE fabric_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE cutting_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE cutting_order_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE cutting_operations ENABLE ROW LEVEL SECURITY;
ALTER TABLE schema_version ENABLE ROW LEVEL SECURITY; 