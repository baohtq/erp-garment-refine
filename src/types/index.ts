// Định nghĩa kiểu dữ liệu cho nhà cung cấp
export interface Supplier {
  id: string;
  name: string;
  contact_person: string;
  phone: string;
  email: string;
  address: string;
  status: string;
  created_at: string;
  updated_at?: string;
}

// Định nghĩa kiểu dữ liệu cho nguyên vật liệu
export interface Material {
  id: string;
  code: string;
  name: string;
  type: string;
  unit: string;
  stock_quantity: number;
  min_quantity: number;
  price: number;
  supplier_id: string;
  supplier_name?: string;
  status: string;
  created_at: string;
  updated_at?: string;
}

// Định nghĩa kiểu dữ liệu cho sản phẩm
export interface Product {
  id: string;
  code: string;
  name: string;
  description?: string;
  category?: string;
  unit_price: number;
  image_url?: string;
  status: string;
  created_at: string;
  updated_at?: string;
}

// Định nghĩa kiểu dữ liệu cho định mức sản phẩm
export interface ProductStandard {
  id: string;
  product_id: string;
  material_id: string;
  quantity: number;
  notes?: string;
  material?: Material;
  created_at: string;
  updated_at?: string;
}

// Định nghĩa kiểu dữ liệu cho đơn hàng sản xuất
export interface ProductionOrder {
  id: string;
  order_number: string;
  customer_name: string;
  order_date: string;
  delivery_date?: string;
  status: string;
  total_quantity?: number;
  notes?: string;
  created_at: string;
  updated_at?: string;
  items?: ProductionOrderItem[];
}

// Định nghĩa kiểu dữ liệu cho chi tiết đơn hàng sản xuất
export interface ProductionOrderItem {
  id: string;
  production_order_id: string;
  product_id: string;
  product?: Product;
  quantity: number;
  unit_price: number;
  status: string;
  created_at: string;
  updated_at?: string;
}

// Các trạng thái
export enum Status {
  ACTIVE = 'active',
  INACTIVE = 'inactive'
}

export enum OrderStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

// Các loại nguyên vật liệu
export const MATERIAL_TYPES = [
  { value: "fabric", label: "Vải" },
  { value: "button", label: "Cúc" },
  { value: "zipper", label: "Khóa kéo" },
  { value: "thread", label: "Chỉ" },
  { value: "elastic", label: "Thun" },
  { value: "label", label: "Nhãn mác" },
  { value: "packaging", label: "Bao bì" },
  { value: "accessory", label: "Phụ kiện khác" },
];

// Các đơn vị tính
export const UNITS = [
  { value: "m", label: "Mét" },
  { value: "kg", label: "Kg" },
  { value: "yard", label: "Yard" },
  { value: "pcs", label: "Cái" },
  { value: "roll", label: "Cuộn" },
  { value: "dozen", label: "Tá" },
  { value: "box", label: "Hộp" },
];

// Các loại sản phẩm
export const PRODUCT_CATEGORIES = [
  { value: "shirt", label: "Áo sơ mi" },
  { value: "tshirt", label: "Áo thun" },
  { value: "pants", label: "Quần" },
  { value: "jeans", label: "Quần jean" },
  { value: "dress", label: "Váy đầm" },
  { value: "jacket", label: "Áo khoác" },
  { value: "underwear", label: "Đồ lót" },
  { value: "other", label: "Khác" },
]; 