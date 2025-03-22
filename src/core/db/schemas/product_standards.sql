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

-- RLS
ALTER TABLE product_standards ENABLE ROW LEVEL SECURITY; 