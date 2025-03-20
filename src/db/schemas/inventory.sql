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

-- RLS
ALTER TABLE material_receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE material_receipt_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE material_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE material_issue_items ENABLE ROW LEVEL SECURITY; 