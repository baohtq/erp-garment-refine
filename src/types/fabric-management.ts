// Định nghĩa các types cho module quản lý vải

export interface Supplier {
  id: number;
  name: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  address?: string;
  status: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Fabric {
  id: number;
  name: string;
  code: string;
  supplier_id: number;
  material_type: string;
  width: number;
  weight_per_meter: number;
  color: string;
  pattern?: string;
  stretch_percentage?: number;
  shrinkage_percentage?: number;
  price_per_meter?: number;
  currency?: string;
  min_stock_level?: number;
  image_url?: string;
  status: string;
  notes?: string;
  supplier_name?: string;
  created_at: string;
  updated_at: string;
}

export interface FabricInventory {
  id: number;
  fabric_id: number;
  roll_code: string;
  batch_number?: string;
  lot_number?: string;
  length: number;
  weight: number;
  warehouse_location?: string;
  quality_grade: string;
  received_date: string;
  status: string;
  defect_notes?: string;
  image_url?: string;
  fabric_name?: string;
  fabric_code?: string;
  created_at: string;
  updated_at: string;
}

export interface CuttingOrder {
  id: number;
  order_code: string;
  production_order_id?: number;
  production_order_no?: string;
  style_no?: string;
  quantity: number;
  planned_date: string;
  planned_end_date?: string;
  actual_start_date?: string;
  actual_end_date?: string;
  status: string;
  priority?: string;
  assigned_to?: number;
  approved_by?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CuttingOrderDetail {
  id: number;
  cutting_order_id: number;
  fabric_id: number;
  color?: string;
  size?: string;
  quantity: number;
  length_required: number;
  width_required?: number;
  marker_length?: number;
  efficiency_percentage?: number;
  actual_consumption?: number;
  variance_percentage?: number;
  notes?: string;
  fabric_name?: string;
  fabric_code?: string;
  created_at: string;
  updated_at: string;
}

export interface FabricIssue {
  id: number;
  issue_code: string;
  issue_date: string;
  production_order_id?: number;
  production_order_no?: string;
  cutting_order_id?: number;
  cutting_order_no?: string;
  issued_by: number;
  received_by?: number;
  status: string;
  notes?: string;
  total_rolls?: number;
  total_length?: number;
  total_weight?: number;
  created_at: string;
  updated_at: string;
}

export interface FabricIssueItem {
  id: number;
  fabric_issue_id: number;
  inventory_id: number;
  length: number;
  weight: number;
  notes?: string;
  inventory_roll_code?: string;
  fabric_name?: string;
  fabric_code?: string;
  created_at: string;
  updated_at: string;
}

export interface InventoryCheck {
  id: number;
  check_code: string;
  check_date: string;
  warehouse_id?: number;
  status: string;
  notes?: string;
  created_by: number;
  approved_by?: number;
  created_at: string;
  updated_at: string;
}

export interface InventoryCheckItem {
  id: number;
  inventory_check_id: number;
  inventory_id: number;
  expected_length: number;
  expected_weight: number;
  actual_length?: number;
  actual_weight?: number;
  status: string;
  notes?: string;
  inventory_roll_code?: string;
  fabric_name?: string;
  fabric_code?: string;
  created_at: string;
  updated_at: string;
}

export interface QualityControlRecord {
  id: number;
  inventory_id: number;
  inspection_date: string;
  inspected_by: number;
  original_grade?: string;
  new_grade: string;
  comments?: string;
  inventory_roll_code?: string;
  fabric_name?: string;
  fabric_code?: string;
  created_at: string;
  updated_at: string;
}

export interface QualityDefect {
  id: number;
  quality_record_id: number;
  defect_type: string;
  defect_position?: string;
  severity: string;
  length?: number;
  width?: number;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Employee {
  id: number;
  name: string;
  position?: string;
  department?: string;
  email?: string;
  phone?: string;
  is_active?: boolean;
}

export interface Warehouse {
  id: number;
  name: string;
  location?: string;
  capacity?: number;
  manager_id?: number;
  status: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ProductionOrder {
  id: number;
  order_number: string;
  customer_id?: number;
  customer_name?: string;
  style_no: string;
  quantity: number;
  order_date: string;
  delivery_date: string;
  status: string;
  priority?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  totalFabrics: number;
  totalInventory: number;
  availableInventory: number;
  reservedInventory: number;
  inUseInventory: number;
  usedInventory: number;
  lowStockFabrics: Fabric[];
  statusCounts: { status: string; count: number }[];
  qualityCounts: { quality_grade: string; count: number }[];
  totalAvailableLength: number;
  totalAvailableWeight: number;
}

export type FabricStatus = 'active' | 'inactive' | 'discontinued';
export type InventoryStatus = 'available' | 'reserved' | 'in_use' | 'used';
export type QualityGrade = 'A' | 'B' | 'C' | 'D' | 'defective';
export type CuttingOrderStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';
export type FabricIssueStatus = 'pending' | 'issued' | 'received' | 'cancelled';
export type InventoryCheckStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';
export type DefectSeverity = 'minor' | 'moderate' | 'major' | 'critical';
export type PriorityLevel = 'low' | 'medium' | 'high' | 'urgent'; 