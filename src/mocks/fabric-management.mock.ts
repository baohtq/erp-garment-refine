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
    image_url: "https://images.unsplash.com/photo-1600045618548-1df34bfce0dc?q=80&w=200&auto=format&fit=crop",
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
    image_url: "https://images.unsplash.com/photo-1617440168937-c6497eaa8db5?q=80&w=200&auto=format&fit=crop",
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
    image_url: "https://images.unsplash.com/photo-1541429403585-811b7ede9f32?q=80&w=200&auto=format&fit=crop",
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
    image_url: "https://images.unsplash.com/photo-1528459061998-56fd57ad86e3?q=80&w=200&auto=format&fit=crop",
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
    image_url: "https://images.unsplash.com/photo-1564500601744-b4dbb1d60277?q=80&w=200&auto=format&fit=crop",
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
    image_url: "https://images.unsplash.com/photo-1600075873274-748a93d61cbd?q=80&w=200&auto=format&fit=crop",
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