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

-- RLS
ALTER TABLE fabric_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE fabric_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE cutting_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE cutting_order_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE cutting_operations ENABLE ROW LEVEL SECURITY; 