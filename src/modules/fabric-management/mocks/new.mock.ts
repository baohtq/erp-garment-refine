// Định nghĩa kiểu dữ liệu
export interface Fabric {
  id: number;
  code: string;
  name: string;
  description: string | null;
  width: number;
  weight: number;
  color: string;
  pattern: string;
  composition: string;
  supplier_id: number | null;
  supplier_name?: string;
  unit: string;
  price: number;
  min_stock: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface FabricInventory {
  id: number;
  fabric_id: number;
  fabric_name?: string;
  lot_number: string;
  supplier_code: string;
  roll_id: string;
  length: number;
  width: number;
  weight: number;
  defect_notes: string | null;
  quality_grade: string;
  location: string;
  status: string;
  color_code: string;
  image_url: string;
  created_at: string;
  updated_at: string;
}

export interface CuttingOrder {
  id: number;
  order_no: string;
  production_order_id: number;
  production_order_no?: string;
  planned_start_date: string;
  planned_end_date: string;
  actual_start_date: string | null;
  actual_end_date: string | null;
  status: string;
  notes: string | null;
  created_by: number;
  created_at: string;
  updated_at: string;
}

export interface Supplier {
  id: number;
  name: string;
}

// Kiểu dữ liệu cho phiếu xuất vải
export interface FabricIssue {
  id: number;
  issue_code: string;
  issue_date: string;
  production_order_id: number | null;
  production_order_no?: string;
  cutting_order_id: number | null;
  cutting_order_no?: string;
  issued_by: number;
  issued_by_name?: string;
  received_by: number;
  received_by_name?: string;
  status: string;
  notes: string | null;
  total_rolls: number;
  total_length: number;
  total_weight: number;
  created_at: string;
  updated_at: string;
}

export interface FabricIssueItem {
  id: number;
  issueId: number;
  inventory_id: number;
  fabric_id: number;
  fabric_name?: string;
  roll_id: string;
  length: number;
  width: number;
  weight: number;
  color_code?: string;
  created_at: string;
  updated_at: string;
}

// Nhân viên
export interface Employee {
  id: number;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  status: string;
}

// Chi tiết lệnh cắt
export interface CuttingOrderDetail {
  id: number;
  cutting_order_id: number;
  fabric_id: number;
  fabric_name?: string;
  marker_length: number;
  marker_width: number;
  required_length: number;
  fabric_issued_length: number;
  actual_consumed_length: number | null;
  waste_length: number | null;
  waste_percent: number | null;
  pieces_count: number;
  layers_count: number;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// Đơn hàng sản xuất
export interface ProductionOrder {
  id: number;
  order_number: string;
  customer_name: string;
  order_date: string;
  delivery_date?: string;
  status: string;
  total_quantity?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// Interfaces cho phiếu kiểm kê
export interface InventoryCheck {
  id: number;
  check_code: string;
  check_date: string;
  status: 'draft' | 'in-progress' | 'completed';
  notes: string | null;
  created_by: number;
  created_at: string;
  updated_at: string;
}

export interface InventoryCheckItem {
  id: number;
  checkId: number;
  inventory_id: number;
  fabric_id: number;
  fabric_name: string;
  roll_id: string;
  system_length: number;
  system_weight: number;
  actual_length: number | null;
  actual_weight: number | null;
  length_difference: number | null;
  weight_difference: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// Interface for quality control records
export interface QualityControlRecord {
  id: number;
  fabricId: number;
  inventoryId: number | null;
  inspectionDate: string;
  inspectorId: number;
  lotNumber: string;
  rollNumber: string;
  width: number;
  length: number;
  weight: number;
  color: string;
  colorFastness: string;
  shrinkage: number;
  tensileStrength: number;
  tearStrength: number;
  defects: string[];
  status: string;
  grade: string;
  notes: string;
}

// Mock data cho vải
export const mockFabrics: Fabric[] = [
  {
    id: 1,
    code: 'FB001',
    name: 'Vải kate cotton 100%',
    description: 'Vải được làm từ 100% cotton, mềm mại và thoáng khí',
    width: 1.6,
    weight: 250,
    color: 'Trắng',
    pattern: 'Trơn',
    composition: '100% Cotton',
    supplier_id: 1,
    supplier_name: 'Vải Nam Định',
    unit: 'm',
    price: 80000,
    min_stock: 100,
    status: 'active',
    created_at: '2023-01-15T00:00:00Z',
    updated_at: '2023-01-15T00:00:00Z'
  },
  {
    id: 2,
    code: 'FB002',
    name: 'Vải jeans',
    description: 'Vải jeans cao cấp, bền và chắc chắn',
    width: 1.5,
    weight: 350,
    color: 'Xanh đậm',
    pattern: 'Trơn',
    composition: '98% Cotton, 2% Spandex',
    supplier_id: 2,
    supplier_name: 'Dệt may Thành Công',
    unit: 'm',
    price: 95000,
    min_stock: 80,
    status: 'active',
    created_at: '2023-01-20T00:00:00Z',
    updated_at: '2023-01-20T00:00:00Z'
  },
  {
    id: 3,
    code: 'FB003',
    name: 'Vải lụa tơ tằm',
    description: 'Vải lụa tơ tằm cao cấp, mềm mại và óng ánh',
    width: 1.4,
    weight: 120,
    color: 'Trắng ngà',
    pattern: 'Trơn',
    composition: '100% Silk',
    supplier_id: 3,
    supplier_name: 'Lụa Bảo Lộc',
    unit: 'm',
    price: 350000,
    min_stock: 30,
    status: 'active',
    created_at: '2023-02-05T00:00:00Z',
    updated_at: '2023-02-05T00:00:00Z'
  }
];

// Dữ liệu mock cho kho vải
export const mockFabricInventory: FabricInventory[] = [
  {
    id: 1,
    fabric_id: 1,
    fabric_name: 'Vải kate cotton 100%',
    lot_number: 'LOT-2023-001',
    supplier_code: 'SUP001',
    roll_id: 'ROLL0001',
    length: 100,
    width: 1.6,
    weight: 40,
    defect_notes: null,
    quality_grade: 'A',
    location: 'A-01-01',
    status: 'in-stock',
    color_code: '#FFFFFF',
    image_url: 'https://example.com/images/fabrics/white-cotton.jpg',
    created_at: '2023-01-15T00:00:00Z',
    updated_at: '2023-01-15T00:00:00Z'
  },
  {
    id: 2,
    fabric_id: 1,
    fabric_name: 'Vải kate cotton 100%',
    lot_number: 'LOT-2023-001',
    supplier_code: 'SUP001',
    roll_id: 'ROLL0002',
    length: 80,
    width: 1.6,
    weight: 32,
    defect_notes: 'Có vết ố nhỏ ở mét thứ 15',
    quality_grade: 'B',
    location: 'A-01-02',
    status: 'in-stock',
    color_code: '#FFFFFF',
    image_url: 'https://example.com/images/fabrics/white-cotton.jpg',
    created_at: '2023-01-15T00:00:00Z',
    updated_at: '2023-01-15T00:00:00Z'
  }
];

// Các hàm utility
export const getFabricById = (id: number): Fabric | undefined => {
  return mockFabrics.find(fabric => fabric.id === id);
};

export const getInventoryItemById = (id: number): FabricInventory | undefined => {
  return mockFabricInventory.find(item => item.id === id);
};

export const getInventoryByFabricId = (fabricId: number): FabricInventory[] => {
  return mockFabricInventory.filter(item => item.fabric_id === fabricId);
}; 