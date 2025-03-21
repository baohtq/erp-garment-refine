-- Functions và stored procedures cho hệ thống erp-garment
-- File này chứa các hàm tối ưu truy vấn và xử lý dữ liệu

---------------------------------------------------------------------------
-- FUNCTIONS FOR DASHBOARD AND STATISTICS
---------------------------------------------------------------------------

-- Lấy số lượng cuộn vải theo trạng thái
CREATE OR REPLACE FUNCTION get_inventory_counts_by_status()
RETURNS TABLE (status TEXT, count BIGINT) 
LANGUAGE SQL
AS $$
  SELECT 
    status, 
    COUNT(*) 
  FROM 
    fabric_inventory 
  GROUP BY 
    status 
  ORDER BY 
    count DESC;
$$;

-- Lấy số lượng cuộn vải theo cấp chất lượng
CREATE OR REPLACE FUNCTION get_inventory_counts_by_quality_grade()
RETURNS TABLE (quality_grade TEXT, count BIGINT) 
LANGUAGE SQL
AS $$
  SELECT 
    quality_grade, 
    COUNT(*) 
  FROM 
    fabric_inventory 
  GROUP BY 
    quality_grade 
  ORDER BY 
    count DESC;
$$;

-- Lấy danh sách vải sắp hết hàng
CREATE OR REPLACE FUNCTION get_low_stock_fabrics(threshold INT DEFAULT 5)
RETURNS TABLE (
  fabric_id INT,
  name TEXT,
  code TEXT,
  available_count BIGINT,
  available_length NUMERIC,
  supplier_name TEXT
) 
LANGUAGE SQL
AS $$
  SELECT 
    f.id AS fabric_id,
    f.name,
    f.code,
    COUNT(i.id) AS available_count,
    SUM(i.length) AS available_length,
    s.name AS supplier_name
  FROM 
    fabrics f
  LEFT JOIN 
    fabric_inventory i ON f.id = i.fabric_id AND i.status = 'available'
  LEFT JOIN
    suppliers s ON f.supplier_id = s.id
  GROUP BY 
    f.id, f.name, f.code, s.name
  HAVING 
    COUNT(i.id) <= threshold
  ORDER BY 
    available_count ASC;
$$;

-- Lấy thống kê tổng quan về kho vải
CREATE OR REPLACE FUNCTION get_fabric_inventory_summary()
RETURNS TABLE (
  total_fabrics BIGINT,
  total_inventory BIGINT,
  available_inventory BIGINT,
  reserved_inventory BIGINT,
  in_use_inventory BIGINT,
  used_inventory BIGINT,
  total_available_length NUMERIC,
  total_available_weight NUMERIC
) 
LANGUAGE SQL
AS $$
  SELECT
    (SELECT COUNT(*) FROM fabrics) AS total_fabrics,
    (SELECT COUNT(*) FROM fabric_inventory) AS total_inventory,
    COUNT(CASE WHEN status = 'available' THEN 1 END) AS available_inventory,
    COUNT(CASE WHEN status = 'reserved' THEN 1 END) AS reserved_inventory,
    COUNT(CASE WHEN status = 'in_use' THEN 1 END) AS in_use_inventory,
    COUNT(CASE WHEN status = 'used' THEN 1 END) AS used_inventory,
    SUM(CASE WHEN status = 'available' THEN length ELSE 0 END) AS total_available_length,
    SUM(CASE WHEN status = 'available' THEN weight ELSE 0 END) AS total_available_weight
  FROM
    fabric_inventory;
$$;

---------------------------------------------------------------------------
-- TRANSACTION FUNCTIONS
---------------------------------------------------------------------------

-- Tạo phiếu xuất vải và các mục liên quan
CREATE OR REPLACE FUNCTION create_fabric_issue(
  issue_data JSONB,
  issue_items_data JSONB
) 
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_issue_id INT;
  item JSONB;
  inventory_id INT;
  result JSONB;
BEGIN
  -- Tạo phiếu xuất vải
  INSERT INTO fabric_issues (
    issue_code,
    issue_date,
    production_order_id,
    production_order_no,
    cutting_order_id,
    cutting_order_no,
    issued_by,
    received_by,
    status,
    notes,
    total_rolls,
    total_length,
    total_weight,
    created_at,
    updated_at
  )
  VALUES (
    issue_data->>'issue_code',
    (issue_data->>'issue_date')::TIMESTAMPTZ,
    (issue_data->>'production_order_id')::INT,
    issue_data->>'production_order_no',
    (issue_data->>'cutting_order_id')::INT,
    issue_data->>'cutting_order_no',
    (issue_data->>'issued_by')::INT,
    (issue_data->>'received_by')::INT,
    issue_data->>'status',
    issue_data->>'notes',
    (issue_data->>'total_rolls')::INT,
    (issue_data->>'total_length')::NUMERIC,
    (issue_data->>'total_weight')::NUMERIC,
    NOW(),
    NOW()
  )
  RETURNING id INTO new_issue_id;
  
  -- Thêm các mục liên quan
  FOR item IN SELECT * FROM jsonb_array_elements(issue_items_data)
  LOOP
    inventory_id := (item->>'inventory_id')::INT;
    
    -- Thêm mục
    INSERT INTO fabric_issue_items (
      fabric_issue_id,
      inventory_id,
      length,
      weight,
      notes,
      created_at,
      updated_at
    )
    VALUES (
      new_issue_id,
      inventory_id,
      (item->>'length')::NUMERIC,
      (item->>'weight')::NUMERIC,
      item->>'notes',
      NOW(),
      NOW()
    );
    
    -- Cập nhật trạng thái cuộn vải
    UPDATE fabric_inventory
    SET 
      status = 'in_use',
      updated_at = NOW()
    WHERE 
      id = inventory_id;
  END LOOP;
  
  -- Lấy thông tin phiếu xuất vừa tạo
  SELECT row_to_json(i) INTO result
  FROM (
    SELECT * FROM fabric_issues WHERE id = new_issue_id
  ) i;
  
  RETURN result;
END;
$$;

-- Tạo kiểm kê kho và các mục liên quan
CREATE OR REPLACE FUNCTION create_inventory_check(
  check_data JSONB,
  check_items_data JSONB
) 
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_check_id INT;
  item JSONB;
  inventory_id INT;
  result JSONB;
BEGIN
  -- Tạo phiếu kiểm kê
  INSERT INTO inventory_checks (
    check_code,
    check_date,
    warehouse_id,
    status,
    notes,
    created_by,
    approved_by,
    created_at,
    updated_at
  )
  VALUES (
    check_data->>'check_code',
    (check_data->>'check_date')::TIMESTAMPTZ,
    (check_data->>'warehouse_id')::INT,
    check_data->>'status',
    check_data->>'notes',
    (check_data->>'created_by')::INT,
    (check_data->>'approved_by')::INT,
    NOW(),
    NOW()
  )
  RETURNING id INTO new_check_id;
  
  -- Thêm các mục chi tiết
  FOR item IN SELECT * FROM jsonb_array_elements(check_items_data)
  LOOP
    inventory_id := (item->>'inventory_id')::INT;
    
    -- Thêm mục
    INSERT INTO inventory_check_items (
      inventory_check_id,
      inventory_id,
      expected_length,
      expected_weight,
      actual_length,
      actual_weight,
      status,
      notes,
      created_at,
      updated_at
    )
    VALUES (
      new_check_id,
      inventory_id,
      (item->>'expected_length')::NUMERIC,
      (item->>'expected_weight')::NUMERIC,
      (item->>'actual_length')::NUMERIC,
      (item->>'actual_weight')::NUMERIC,
      item->>'status',
      item->>'notes',
      NOW(),
      NOW()
    );
  END LOOP;
  
  -- Lấy thông tin phiếu kiểm kê vừa tạo
  SELECT row_to_json(i) INTO result
  FROM (
    SELECT * FROM inventory_checks WHERE id = new_check_id
  ) i;
  
  RETURN result;
END;
$$;

-- Hoàn thành kiểm kê kho và cập nhật kho
CREATE OR REPLACE FUNCTION complete_inventory_check(
  check_id INT,
  approved_by_id INT DEFAULT NULL
) 
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSONB;
  check_item RECORD;
BEGIN
  -- Cập nhật trạng thái phiếu kiểm kê
  UPDATE inventory_checks
  SET 
    status = 'completed',
    approved_by = COALESCE(approved_by_id, approved_by),
    updated_at = NOW()
  WHERE 
    id = check_id AND status != 'completed';
  
  -- Cập nhật kho dựa trên kết quả kiểm kê
  FOR check_item IN 
    SELECT * FROM inventory_check_items
    WHERE inventory_check_id = check_id
  LOOP
    -- Chỉ cập nhật nếu có sự khác biệt
    IF (check_item.actual_length IS NOT NULL AND check_item.actual_weight IS NOT NULL) AND
       (check_item.actual_length != check_item.expected_length OR check_item.actual_weight != check_item.expected_weight) THEN
      
      UPDATE fabric_inventory
      SET 
        length = check_item.actual_length,
        weight = check_item.actual_weight,
        updated_at = NOW()
      WHERE 
        id = check_item.inventory_id;
    END IF;
  END LOOP;
  
  -- Lấy thông tin phiếu kiểm kê vừa cập nhật
  SELECT row_to_json(i) INTO result
  FROM (
    SELECT * FROM inventory_checks WHERE id = check_id
  ) i;
  
  RETURN result;
END;
$$;

-- Tạo báo cáo chất lượng vải và các lỗi liên quan
CREATE OR REPLACE FUNCTION create_quality_record(
  record_data JSONB,
  defects_data JSONB
) 
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_record_id INT;
  defect JSONB;
  result JSONB;
BEGIN
  -- Tạo báo cáo chất lượng
  INSERT INTO quality_control_records (
    inventory_id,
    inspection_date,
    inspected_by,
    original_grade,
    new_grade,
    comments,
    created_at,
    updated_at
  )
  VALUES (
    (record_data->>'inventory_id')::INT,
    (record_data->>'inspection_date')::TIMESTAMPTZ,
    (record_data->>'inspected_by')::INT,
    record_data->>'original_grade',
    record_data->>'new_grade',
    record_data->>'comments',
    NOW(),
    NOW()
  )
  RETURNING id INTO new_record_id;
  
  -- Thêm các lỗi liên quan
  FOR defect IN SELECT * FROM jsonb_array_elements(defects_data)
  LOOP
    -- Thêm lỗi
    INSERT INTO quality_defects (
      quality_record_id,
      defect_type,
      defect_position,
      severity,
      length,
      width,
      description,
      created_at,
      updated_at
    )
    VALUES (
      new_record_id,
      defect->>'defect_type',
      defect->>'defect_position',
      defect->>'severity',
      (defect->>'length')::NUMERIC,
      (defect->>'width')::NUMERIC,
      defect->>'description',
      NOW(),
      NOW()
    );
  END LOOP;
  
  -- Cập nhật cấp chất lượng của cuộn vải
  UPDATE fabric_inventory
  SET 
    quality_grade = record_data->>'new_grade',
    defect_notes = record_data->>'comments',
    updated_at = NOW()
  WHERE 
    id = (record_data->>'inventory_id')::INT;
  
  -- Lấy thông tin báo cáo vừa tạo
  SELECT row_to_json(r) INTO result
  FROM (
    SELECT 
      r.*,
      (SELECT json_agg(d.*) FROM quality_defects d WHERE d.quality_record_id = r.id) AS defects
    FROM 
      quality_control_records r
    WHERE 
      r.id = new_record_id
  ) r;
  
  RETURN result;
END;
$$;

---------------------------------------------------------------------------
-- OPTIMIZATION INDEXES
---------------------------------------------------------------------------

-- Chỉ mục trên các cột tìm kiếm thường xuyên
CREATE INDEX IF NOT EXISTS idx_fabrics_name ON fabrics (name);
CREATE INDEX IF NOT EXISTS idx_fabrics_code ON fabrics (code);
CREATE INDEX IF NOT EXISTS idx_fabrics_material_type ON fabrics (material_type);
CREATE INDEX IF NOT EXISTS idx_fabrics_supplier_id ON fabrics (supplier_id);
CREATE INDEX IF NOT EXISTS idx_fabrics_status ON fabrics (status);

CREATE INDEX IF NOT EXISTS idx_fabric_inventory_roll_code ON fabric_inventory (roll_code);
CREATE INDEX IF NOT EXISTS idx_fabric_inventory_fabric_id ON fabric_inventory (fabric_id);
CREATE INDEX IF NOT EXISTS idx_fabric_inventory_status ON fabric_inventory (status);
CREATE INDEX IF NOT EXISTS idx_fabric_inventory_quality_grade ON fabric_inventory (quality_grade);
CREATE INDEX IF NOT EXISTS idx_fabric_inventory_batch_number ON fabric_inventory (batch_number);

CREATE INDEX IF NOT EXISTS idx_cutting_orders_status ON cutting_orders (status);
CREATE INDEX IF NOT EXISTS idx_cutting_orders_planned_date ON cutting_orders (planned_date);

CREATE INDEX IF NOT EXISTS idx_fabric_issues_issue_date ON fabric_issues (issue_date);
CREATE INDEX IF NOT EXISTS idx_fabric_issues_status ON fabric_issues (status);
CREATE INDEX IF NOT EXISTS idx_fabric_issues_cutting_order_id ON fabric_issues (cutting_order_id);

CREATE INDEX IF NOT EXISTS idx_inventory_checks_check_date ON inventory_checks (check_date);
CREATE INDEX IF NOT EXISTS idx_inventory_checks_status ON inventory_checks (status);

CREATE INDEX IF NOT EXISTS idx_quality_records_inspection_date ON quality_control_records (inspection_date);
CREATE INDEX IF NOT EXISTS idx_quality_records_inventory_id ON quality_control_records (inventory_id);

-- Chỉ mục GIN cho tìm kiếm văn bản
CREATE INDEX IF NOT EXISTS idx_fabrics_fts ON fabrics USING gin(to_tsvector('english', name || ' ' || code || ' ' || material_type));
CREATE INDEX IF NOT EXISTS idx_inventory_fts ON fabric_inventory USING gin(to_tsvector('english', roll_code || ' ' || batch_number || ' ' || lot_number));

---------------------------------------------------------------------------
-- MATERIALIZED VIEWS FOR DASHBOARD
---------------------------------------------------------------------------

-- Materialized view cho thống kê kho vải
CREATE MATERIALIZED VIEW IF NOT EXISTS fabric_inventory_stats AS
SELECT
  count(*) AS total_inventory,
  sum(CASE WHEN status = 'available' THEN 1 ELSE 0 END) AS available_count,
  sum(CASE WHEN status = 'reserved' THEN 1 ELSE 0 END) AS reserved_count,
  sum(CASE WHEN status = 'in_use' THEN 1 ELSE 0 END) AS in_use_count,
  sum(CASE WHEN status = 'used' THEN 1 ELSE 0 END) AS used_count,
  sum(CASE WHEN status = 'available' THEN length ELSE 0 END) AS total_available_length,
  sum(CASE WHEN status = 'available' THEN weight ELSE 0 END) AS total_available_weight,
  count(DISTINCT fabric_id) AS unique_fabrics_count
FROM
  fabric_inventory;

-- Hàm cập nhật materialized view
CREATE OR REPLACE FUNCTION refresh_fabric_inventory_stats()
RETURNS TRIGGER AS $$
BEGIN
  REFRESH MATERIALIZED VIEW fabric_inventory_stats;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger để tự động cập nhật materialized view
CREATE TRIGGER refresh_fabric_inventory_stats_trigger
AFTER INSERT OR UPDATE OR DELETE ON fabric_inventory
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_fabric_inventory_stats();

-- Materialized view cho số lượng cuộn vải theo loại vải
CREATE MATERIALIZED VIEW IF NOT EXISTS fabric_inventory_by_fabric AS
SELECT
  f.id AS fabric_id,
  f.name AS fabric_name,
  f.code AS fabric_code,
  f.supplier_id,
  s.name AS supplier_name,
  count(i.id) AS total_rolls,
  sum(CASE WHEN i.status = 'available' THEN 1 ELSE 0 END) AS available_rolls,
  sum(CASE WHEN i.status = 'available' THEN i.length ELSE 0 END) AS available_length,
  sum(CASE WHEN i.status = 'available' THEN i.weight ELSE 0 END) AS available_weight
FROM
  fabrics f
LEFT JOIN
  fabric_inventory i ON f.id = i.fabric_id
LEFT JOIN
  suppliers s ON f.supplier_id = s.id
GROUP BY
  f.id, f.name, f.code, f.supplier_id, s.name;

-- Hàm cập nhật materialized view
CREATE OR REPLACE FUNCTION refresh_fabric_inventory_by_fabric()
RETURNS TRIGGER AS $$
BEGIN
  REFRESH MATERIALIZED VIEW fabric_inventory_by_fabric;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Triggers để tự động cập nhật materialized view
CREATE TRIGGER refresh_fabric_inventory_by_fabric_trigger_inventory
AFTER INSERT OR UPDATE OR DELETE ON fabric_inventory
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_fabric_inventory_by_fabric();

CREATE TRIGGER refresh_fabric_inventory_by_fabric_trigger_fabrics
AFTER INSERT OR UPDATE OR DELETE ON fabrics
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_fabric_inventory_by_fabric();

CREATE TRIGGER refresh_fabric_inventory_by_fabric_trigger_suppliers
AFTER INSERT OR UPDATE OR DELETE ON suppliers
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_fabric_inventory_by_fabric(); 