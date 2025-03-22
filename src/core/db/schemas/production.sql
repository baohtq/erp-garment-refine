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

-- RLS
ALTER TABLE production_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE production_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE production_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE finished_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_productivity ENABLE ROW LEVEL SECURITY; 