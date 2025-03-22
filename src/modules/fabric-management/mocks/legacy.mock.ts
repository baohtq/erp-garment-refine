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
  fabric_issue_id: number;
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
  inventory_check_id: number;
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

// Mock data cho nhà cung cấp
export const mockSuppliers: Supplier[] = [
  {
    id: 1,
    name: "Công ty Dệt may Phương Nam"
  },
  {
    id: 2,
    name: "Công ty TNHH Vải Tân Long"
  },
  {
    id: 3,
    name: "Công ty Cổ phần Dệt may Việt Thắng"
  },
  {
    id: 4,
    name: "Nhập khẩu Hàn Quốc"
  },
  {
    id: 5,
    name: "Nhập khẩu Trung Quốc"
  }
];

// Mock data cho vải
export const mockFabrics: Fabric[] = [
  {
    id: 1,
    code: "KK001",
    name: "Kaki thun 2 chiều",
    description: "Vải kaki thun co giãn 2 chiều, thích hợp may quần âu, quần tây",
    width: 150,
    weight: 250,
    color: "Đen",
    pattern: "Trơn",
    composition: "98% cotton, 2% spandex",
    supplier_id: 1,
    supplier_name: "Công ty Dệt may Phương Nam",
    unit: "m",
    price: 90000,
    min_stock: 50,
    status: "active",
    created_at: "2023-01-10T08:30:00Z",
    updated_at: "2023-01-10T08:30:00Z"
  },
  {
    id: 2,
    code: "JN001",
    name: "Jean cotton",
    description: "Vải jean cotton cứng, dày và bền, thích hợp may quần jean",
    width: 150,
    weight: 350,
    color: "Xanh đậm",
    pattern: "Trơn",
    composition: "100% cotton",
    supplier_id: 2,
    supplier_name: "Công ty TNHH Vải Tân Long",
    unit: "m",
    price: 120000,
    min_stock: 30,
    status: "active",
    created_at: "2023-01-15T10:15:00Z",
    updated_at: "2023-01-15T10:15:00Z"
  },
  {
    id: 3,
    code: "KT001",
    name: "Kate lụa",
    description: "Vải kate lụa mềm mại, thích hợp may áo sơ mi cao cấp",
    width: 140,
    weight: 180,
    color: "Trắng",
    pattern: "Trơn",
    composition: "65% cotton, 35% polyester",
    supplier_id: 3,
    supplier_name: "Công ty Cổ phần Dệt may Việt Thắng",
    unit: "m",
    price: 85000,
    min_stock: 50,
    status: "active",
    created_at: "2023-02-05T14:20:00Z",
    updated_at: "2023-02-05T14:20:00Z"
  },
  {
    id: 4,
    code: "TT001",
    name: "Cotton thun 4 chiều",
    description: "Vải thun cotton co giãn 4 chiều, thích hợp may áo thun, áo polo",
    width: 180,
    weight: 200,
    color: "Xám",
    pattern: "Trơn",
    composition: "95% cotton, 5% spandex",
    supplier_id: 4,
    supplier_name: "Nhập khẩu Hàn Quốc",
    unit: "kg",
    price: 150000,
    min_stock: 20,
    status: "active",
    created_at: "2023-02-10T09:45:00Z",
    updated_at: "2023-02-10T09:45:00Z"
  },
  {
    id: 5,
    code: "FL001",
    name: "Linen cao cấp",
    description: "Vải linen cao cấp, thoáng mát, phù hợp thời trang hè",
    width: 145,
    weight: 170,
    color: "Be",
    pattern: "Trơn",
    composition: "100% linen",
    supplier_id: 5,
    supplier_name: "Nhập khẩu Trung Quốc",
    unit: "m",
    price: 180000,
    min_stock: 15,
    status: "active",
    created_at: "2023-02-20T11:30:00Z",
    updated_at: "2023-02-20T11:30:00Z"
  }
];

// Mock data cho kho vải
export const mockInventory: FabricInventory[] = [
  {
    id: 1,
    fabric_id: 1,
    fabric_name: "Kaki thun 2 chiều",
    lot_number: "LOT-KK001-23A",
    supplier_code: "KK-23A-001",
    roll_id: "KK001-R001",
    length: 100,
    width: 150,
    weight: 25,
    defect_notes: null,
    quality_grade: "A",
    location: "Kho A - Kệ A1",
    status: "available",
    color_code: "#000000",
    image_url: "https://images.unsplash.com/photo-1580418827493-f2fb2fa8910c?q=80&w=200&auto=format&fit=crop",
    created_at: "2023-03-05T09:00:00Z",
    updated_at: "2023-03-05T09:00:00Z"
  },
  {
    id: 2,
    fabric_id: 1,
    fabric_name: "Kaki thun 2 chiều",
    lot_number: "LOT-KK001-23A",
    supplier_code: "KK-23A-002",
    roll_id: "KK001-R002",
    length: 100,
    width: 150,
    weight: 25,
    defect_notes: "Có vết ố nhẹ ở cuối cuộn",
    quality_grade: "B",
    location: "Kho A - Kệ A1",
    status: "available",
    color_code: "#0d0d0d",
    image_url: "https://images.unsplash.com/photo-1595515106864-077d54b1619c?q=80&w=200&auto=format&fit=crop",
    created_at: "2023-03-05T09:15:00Z",
    updated_at: "2023-03-05T09:15:00Z"
  },
  {
    id: 3,
    fabric_id: 2,
    fabric_name: "Jean cotton",
    lot_number: "LOT-JN001-23B",
    supplier_code: "JC-23B-103",
    roll_id: "JN001-R001",
    length: 80,
    width: 150,
    weight: 28,
    defect_notes: null,
    quality_grade: "A",
    location: "Kho A - Kệ B2",
    status: "available",
    color_code: "#0a3b78",
    image_url: "https://images.unsplash.com/photo-1583265627959-fb7042f5133b?q=80&w=200&auto=format&fit=crop",
    created_at: "2023-03-10T10:30:00Z",
    updated_at: "2023-03-10T10:30:00Z"
  },
  {
    id: 4,
    fabric_id: 3,
    fabric_name: "Kate lụa",
    lot_number: "LOT-KT001-23C",
    supplier_code: "KL-23C-045",
    roll_id: "KT001-R001",
    length: 120,
    width: 140,
    weight: 21.6,
    defect_notes: null,
    quality_grade: "A",
    location: "Kho B - Kệ C1",
    status: "reserved",
    color_code: "#ffffff",
    image_url: "https://images.unsplash.com/photo-1584589167171-541ce45f1eea?q=80&w=200&auto=format&fit=crop",
    created_at: "2023-03-15T14:00:00Z",
    updated_at: "2023-03-15T14:00:00Z"
  },
  {
    id: 5,
    fabric_id: 4,
    fabric_name: "Cotton thun 4 chiều",
    lot_number: "LOT-TT001-23D",
    supplier_code: "CT4C-23D-067",
    roll_id: "TT001-R001",
    length: 50,
    width: 180,
    weight: 10,
    defect_notes: null,
    quality_grade: "A",
    location: "Kho B - Kệ D3",
    status: "in_use",
    color_code: "#808080",
    image_url: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=200&auto=format&fit=crop",
    created_at: "2023-03-20T11:30:00Z",
    updated_at: "2023-03-20T11:30:00Z"
  },
  {
    id: 6,
    fabric_id: 5,
    fabric_name: "Linen cao cấp",
    lot_number: "LOT-FL001-23E",
    supplier_code: "LCC-23E-021",
    roll_id: "FL001-R001",
    length: 70,
    width: 145,
    weight: 12,
    defect_notes: "Vết xước nhẹ ở giữa cuộn",
    quality_grade: "B",
    location: "Kho C - Kệ E1",
    status: "available",
    color_code: "#d2b48c",
    image_url: "https://images.unsplash.com/photo-1621273574341-14cf448be06f?q=80&w=200&auto=format&fit=crop",
    created_at: "2023-03-25T13:45:00Z",
    updated_at: "2023-03-25T13:45:00Z"
  }
];

// Mock data cho lệnh cắt
export const mockCuttingOrders: CuttingOrder[] = [
  {
    id: 1,
    order_no: "CUT-2023-001",
    production_order_id: 101,
    production_order_no: "PO-2023-101",
    planned_start_date: "2023-04-05T08:00:00Z",
    planned_end_date: "2023-04-06T17:00:00Z",
    actual_start_date: "2023-04-05T08:30:00Z",
    actual_end_date: "2023-04-06T16:00:00Z",
    status: "completed",
    notes: "Hoàn thành đúng tiến độ",
    created_by: 1,
    created_at: "2023-04-01T10:00:00Z",
    updated_at: "2023-04-06T16:00:00Z"
  },
  {
    id: 2,
    order_no: "CUT-2023-002",
    production_order_id: 102,
    production_order_no: "PO-2023-102",
    planned_start_date: "2023-04-10T08:00:00Z",
    planned_end_date: "2023-04-11T17:00:00Z",
    actual_start_date: "2023-04-10T09:00:00Z",
    actual_end_date: null,
    status: "in-progress",
    notes: null,
    created_by: 1,
    created_at: "2023-04-05T14:30:00Z",
    updated_at: "2023-04-10T09:00:00Z"
  },
  {
    id: 3,
    order_no: "CUT-2023-003",
    production_order_id: 103,
    production_order_no: "PO-2023-103",
    planned_start_date: "2023-04-15T08:00:00Z",
    planned_end_date: "2023-04-16T17:00:00Z",
    actual_start_date: null,
    actual_end_date: null,
    status: "pending",
    notes: "Đang chờ vải về kho",
    created_by: 2,
    created_at: "2023-04-08T11:15:00Z",
    updated_at: "2023-04-08T11:15:00Z"
  },
  {
    id: 4,
    order_no: "CUT-2023-004",
    production_order_id: 104,
    production_order_no: "PO-2023-104",
    planned_start_date: "2023-04-20T08:00:00Z",
    planned_end_date: "2023-04-21T17:00:00Z",
    actual_start_date: null,
    actual_end_date: null,
    status: "pending",
    notes: null,
    created_by: 1,
    created_at: "2023-04-12T09:30:00Z",
    updated_at: "2023-04-12T09:30:00Z"
  },
  {
    id: 5,
    order_no: "CUT-2023-005",
    production_order_id: 105,
    production_order_no: "PO-2023-105",
    planned_start_date: "2023-04-01T08:00:00Z",
    planned_end_date: "2023-04-02T17:00:00Z",
    actual_start_date: null,
    actual_end_date: null,
    status: "cancelled",
    notes: "Hủy do thay đổi kế hoạch sản xuất",
    created_by: 2,
    created_at: "2023-03-25T16:45:00Z",
    updated_at: "2023-03-30T10:15:00Z"
  }
];

// Mock data cho phiếu xuất vải
export const mockFabricIssues: FabricIssue[] = [
  {
    id: 1,
    issue_code: "PXV-23100001",
    issue_date: "2023-10-15T08:30:00Z",
    production_order_id: 1,
    production_order_no: "PO-23100001",
    cutting_order_id: 1,
    cutting_order_no: "CUT-23100001",
    issued_by: 1,
    issued_by_name: "Nguyễn Văn A",
    received_by: 2,
    received_by_name: "Trần Thị B",
    status: "completed",
    notes: "Xuất vải cho lệnh cắt áo sơ mi nam",
    total_rolls: 2,
    total_length: 170,
    total_weight: 46.6,
    created_at: "2023-10-15T08:30:00Z",
    updated_at: "2023-10-15T08:30:00Z"
  },
  {
    id: 2,
    issue_code: "PXV-23100002",
    issue_date: "2023-10-20T09:15:00Z",
    production_order_id: 2,
    production_order_no: "PO-23100002",
    cutting_order_id: 2,
    cutting_order_no: "CUT-23100002",
    issued_by: 1,
    issued_by_name: "Nguyễn Văn A",
    received_by: 3,
    received_by_name: "Lê Văn C",
    status: "completed",
    notes: "Xuất vải cho lệnh cắt quần kaki",
    total_rolls: 1,
    total_length: 80,
    total_weight: 28,
    created_at: "2023-10-20T09:15:00Z",
    updated_at: "2023-10-20T09:15:00Z"
  },
  {
    id: 3,
    issue_code: "PXV-23100003",
    issue_date: "2023-10-25T14:00:00Z",
    production_order_id: 3,
    production_order_no: "PO-23100003",
    cutting_order_id: 3,
    cutting_order_no: "CUT-23100003",
    issued_by: 4,
    issued_by_name: "Phạm Thị D",
    received_by: 3,
    received_by_name: "Lê Văn C",
    status: "pending",
    notes: "Xuất vải cho lệnh cắt áo thun",
    total_rolls: 1,
    total_length: 50,
    total_weight: 10,
    created_at: "2023-10-25T14:00:00Z",
    updated_at: "2023-10-25T14:00:00Z"
  }
];

export const mockFabricIssueItems: FabricIssueItem[] = [
  {
    id: 1,
    fabric_issue_id: 1,
    inventory_id: 1,
    fabric_id: 1,
    fabric_name: "Kaki thun 2 chiều",
    roll_id: "KK001-R001",
    length: 100,
    width: 150,
    weight: 25,
    color_code: "#000000",
    created_at: "2023-10-15T08:30:00Z",
    updated_at: "2023-10-15T08:30:00Z"
  },
  {
    id: 2,
    fabric_issue_id: 1,
    inventory_id: 2,
    fabric_id: 1,
    fabric_name: "Kaki thun 2 chiều",
    roll_id: "KK001-R002",
    length: 70,
    width: 150,
    weight: 21.6,
    color_code: "#0d0d0d",
    created_at: "2023-10-15T08:30:00Z",
    updated_at: "2023-10-15T08:30:00Z"
  },
  {
    id: 3,
    fabric_issue_id: 2,
    inventory_id: 3,
    fabric_id: 2,
    fabric_name: "Jean cotton",
    roll_id: "JN001-R001",
    length: 80,
    width: 150,
    weight: 28,
    color_code: "#0a3b78",
    created_at: "2023-10-20T09:15:00Z",
    updated_at: "2023-10-20T09:15:00Z"
  },
  {
    id: 4,
    fabric_issue_id: 3,
    inventory_id: 5,
    fabric_id: 4,
    fabric_name: "Cotton thun 4 chiều",
    roll_id: "TT001-R001",
    length: 50,
    width: 180,
    weight: 10,
    color_code: "#808080",
    created_at: "2023-10-25T14:00:00Z",
    updated_at: "2023-10-25T14:00:00Z"
  }
];

// Mock dữ liệu nhân viên
export const mockEmployees: Employee[] = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    position: "Quản lý kho",
    department: "Kho",
    email: "nguyenvana@example.com",
    phone: "0901234567",
    status: "active"
  },
  {
    id: 2,
    name: "Trần Thị B",
    position: "Nhân viên cắt",
    department: "Sản xuất",
    email: "tranthib@example.com",
    phone: "0912345678",
    status: "active"
  },
  {
    id: 3,
    name: "Lê Văn C",
    position: "Trưởng bộ phận cắt",
    department: "Sản xuất",
    email: "levanc@example.com",
    phone: "0923456789",
    status: "active"
  },
  {
    id: 4,
    name: "Phạm Thị D",
    position: "Nhân viên kho",
    department: "Kho",
    email: "phamthid@example.com",
    phone: "0934567890",
    status: "active"
  },
  {
    id: 5,
    name: "Hoàng Văn E",
    position: "Giám đốc sản xuất",
    department: "Sản xuất",
    email: "hoangvane@example.com",
    phone: "0945678901",
    status: "active"
  }
];

// Mock data cho chi tiết lệnh cắt
export const mockCuttingOrderDetails: CuttingOrderDetail[] = [
  {
    id: 1,
    cutting_order_id: 1,
    fabric_id: 1,
    fabric_name: "Kaki thun 2 chiều",
    marker_length: 12.5,
    marker_width: 1.5,
    required_length: 150,
    fabric_issued_length: 170,
    actual_consumed_length: 165.5,
    waste_length: 4.5,
    waste_percent: 2.65,
    pieces_count: 120,
    layers_count: 20,
    status: "completed",
    notes: "Lệnh cắt hoàn thành với tỷ lệ hao hụt trong mức cho phép",
    created_at: "2023-04-01T10:00:00Z",
    updated_at: "2023-04-06T16:00:00Z"
  },
  {
    id: 2,
    cutting_order_id: 2,
    fabric_id: 2,
    fabric_name: "Jean cotton",
    marker_length: 8.75,
    marker_width: 1.5,
    required_length: 70,
    fabric_issued_length: 80,
    actual_consumed_length: null,
    waste_length: null,
    waste_percent: null,
    pieces_count: 90,
    layers_count: 15,
    status: "in-progress",
    notes: "Đang tiến hành cắt",
    created_at: "2023-04-05T14:30:00Z",
    updated_at: "2023-04-10T09:00:00Z"
  },
  {
    id: 3,
    cutting_order_id: 3,
    fabric_id: 4,
    fabric_name: "Cotton thun 4 chiều",
    marker_length: 5.2,
    marker_width: 1.8,
    required_length: 50,
    fabric_issued_length: 0,
    actual_consumed_length: null,
    waste_length: null,
    waste_percent: null,
    pieces_count: 60,
    layers_count: 10,
    status: "pending",
    notes: "Đang chờ vải về kho",
    created_at: "2023-04-08T11:15:00Z",
    updated_at: "2023-04-08T11:15:00Z"
  },
  {
    id: 4,
    cutting_order_id: 4,
    fabric_id: 5,
    fabric_name: "Linen cao cấp",
    marker_length: 10.0,
    marker_width: 1.45,
    required_length: 100,
    fabric_issued_length: 0,
    actual_consumed_length: null,
    waste_length: null,
    waste_percent: null,
    pieces_count: 80,
    layers_count: 12,
    status: "pending",
    notes: null,
    created_at: "2023-04-12T09:30:00Z",
    updated_at: "2023-04-12T09:30:00Z"
  }
];

// Mock data cho đơn hàng sản xuất
export const mockProductionOrders: ProductionOrder[] = [
  {
    id: 101,
    order_number: "PO-2023-101",
    customer_name: "Công ty May mặc ABC",
    order_date: "2023-03-15T10:00:00Z",
    delivery_date: "2023-04-25T17:00:00Z",
    status: "completed",
    total_quantity: 500,
    notes: "Đơn hàng áo sơ mi nam",
    created_at: "2023-03-15T10:00:00Z",
    updated_at: "2023-04-26T14:30:00Z"
  },
  {
    id: 102,
    order_number: "PO-2023-102",
    customer_name: "Công ty TNHH Thời trang XYZ",
    order_date: "2023-03-25T09:30:00Z",
    delivery_date: "2023-04-30T17:00:00Z",
    status: "in_progress",
    total_quantity: 300,
    notes: "Đơn hàng quần jean nam",
    created_at: "2023-03-25T09:30:00Z",
    updated_at: "2023-04-10T11:15:00Z"
  },
  {
    id: 103,
    order_number: "PO-2023-103",
    customer_name: "Cửa hàng Thời trang Hiện đại",
    order_date: "2023-04-01T14:45:00Z",
    delivery_date: "2023-05-10T17:00:00Z",
    status: "in_progress",
    total_quantity: 250,
    notes: "Đơn hàng áo thun nữ",
    created_at: "2023-04-01T14:45:00Z",
    updated_at: "2023-04-08T16:30:00Z"
  },
  {
    id: 104,
    order_number: "PO-2023-104",
    customer_name: "Công ty May mặc Việt Long",
    order_date: "2023-04-10T08:15:00Z",
    delivery_date: "2023-05-20T17:00:00Z",
    status: "pending",
    total_quantity: 400,
    notes: "Đơn hàng váy đầm dự tiệc",
    created_at: "2023-04-10T08:15:00Z",
    updated_at: "2023-04-10T08:15:00Z"
  },
  {
    id: 105,
    order_number: "PO-2023-105",
    customer_name: "Công ty Thời trang Đông Á",
    order_date: "2023-03-10T10:30:00Z",
    delivery_date: "2023-04-05T17:00:00Z",
    status: "cancelled",
    total_quantity: 150,
    notes: "Khách hàng hủy đơn",
    created_at: "2023-03-10T10:30:00Z",
    updated_at: "2023-03-20T16:45:00Z"
  }
];

// Mock data cho phiếu kiểm kê
export const mockInventoryChecks: InventoryCheck[] = [
  {
    id: 1,
    check_code: 'INV-CHECK-2023-001',
    check_date: '2023-10-01T08:00:00Z',
    status: 'completed',
    notes: 'Kiểm kê định kỳ tháng 10/2023',
    created_by: 1,
    created_at: '2023-09-28T10:00:00Z',
    updated_at: '2023-10-01T16:30:00Z'
  },
  {
    id: 2,
    check_code: 'INV-CHECK-2023-002',
    check_date: '2023-11-01T08:00:00Z',
    status: 'in-progress',
    notes: 'Kiểm kê định kỳ tháng 11/2023',
    created_by: 1,
    created_at: '2023-10-28T14:20:00Z',
    updated_at: '2023-11-01T10:15:00Z'
  }
];

export const mockInventoryCheckItems: InventoryCheckItem[] = [
  // Các mục kiểm kê cho phiếu 1
  {
    id: 1,
    inventory_check_id: 1,
    inventory_id: 1,
    fabric_id: 1,
    fabric_name: 'Kaki thun 2 chiều',
    roll_id: 'KK001-R001',
    system_length: 100,
    system_weight: 25,
    actual_length: 98.5,
    actual_weight: 24.8,
    length_difference: -1.5,
    weight_difference: -0.2,
    notes: 'Đã sử dụng một phần nhưng chưa cập nhật hệ thống',
    created_at: '2023-10-01T08:30:00Z',
    updated_at: '2023-10-01T08:30:00Z'
  },
  {
    id: 2,
    inventory_check_id: 1,
    inventory_id: 2,
    fabric_id: 1,
    fabric_name: 'Kaki thun 2 chiều',
    roll_id: 'KK001-R002',
    system_length: 70,
    system_weight: 21.6,
    actual_length: 70,
    actual_weight: 21.6,
    length_difference: 0,
    weight_difference: 0,
    notes: null,
    created_at: '2023-10-01T09:15:00Z',
    updated_at: '2023-10-01T09:15:00Z'
  },
  {
    id: 3,
    inventory_check_id: 1,
    inventory_id: 3,
    fabric_id: 2,
    fabric_name: 'Jean cotton',
    roll_id: 'JN001-R001',
    system_length: 80,
    system_weight: 28,
    actual_length: 80,
    actual_weight: 28,
    length_difference: 0,
    weight_difference: 0,
    notes: null,
    created_at: '2023-10-01T10:00:00Z',
    updated_at: '2023-10-01T10:00:00Z'
  },
  {
    id: 4,
    inventory_check_id: 1,
    inventory_id: 4,
    fabric_id: 3,
    fabric_name: 'Kate lụa',
    roll_id: 'KT001-R001',
    system_length: 90,
    system_weight: 16.2,
    actual_length: 85.5,
    actual_weight: 15.4,
    length_difference: -4.5,
    weight_difference: -0.8,
    notes: 'Phát hiện mất mát, cần kiểm tra camera an ninh',
    created_at: '2023-10-01T10:45:00Z',
    updated_at: '2023-10-01T10:45:00Z'
  },
  {
    id: 5,
    inventory_check_id: 1,
    inventory_id: 5,
    fabric_id: 4,
    fabric_name: 'Cotton thun 4 chiều',
    roll_id: 'TT001-R001',
    system_length: 50,
    system_weight: 10,
    actual_length: 50,
    actual_weight: 10,
    length_difference: 0,
    weight_difference: 0,
    notes: null,
    created_at: '2023-10-01T11:20:00Z',
    updated_at: '2023-10-01T11:20:00Z'
  },
  
  // Các mục kiểm kê cho phiếu 2 (đang tiến hành)
  {
    id: 6,
    inventory_check_id: 2,
    inventory_id: 1,
    fabric_id: 1,
    fabric_name: 'Kaki thun 2 chiều',
    roll_id: 'KK001-R001',
    system_length: 98.5, // Đã cập nhật từ lần kiểm kê trước
    system_weight: 24.8,
    actual_length: 98.5,
    actual_weight: 24.8,
    length_difference: 0,
    weight_difference: 0,
    notes: null,
    created_at: '2023-11-01T08:30:00Z',
    updated_at: '2023-11-01T08:30:00Z'
  },
  {
    id: 7,
    inventory_check_id: 2,
    inventory_id: 2,
    fabric_id: 1,
    fabric_name: 'Kaki thun 2 chiều',
    roll_id: 'KK001-R002',
    system_length: 70,
    system_weight: 21.6,
    actual_length: 68.2,
    actual_weight: 21.0,
    length_difference: -1.8,
    weight_difference: -0.6,
    notes: 'Có dấu hiệu sử dụng nhưng không ghi nhận',
    created_at: '2023-11-01T09:15:00Z',
    updated_at: '2023-11-01T09:15:00Z'
  },
  {
    id: 8,
    inventory_check_id: 2,
    inventory_id: 3,
    fabric_id: 2,
    fabric_name: 'Jean cotton',
    roll_id: 'JN001-R001',
    system_length: 80,
    system_weight: 28,
    actual_length: null, // Chưa kiểm kê
    actual_weight: null,
    length_difference: null,
    weight_difference: null,
    notes: null,
    created_at: '2023-11-01T10:00:00Z',
    updated_at: '2023-11-01T10:00:00Z'
  }
]; 