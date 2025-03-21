// Thông tin kết nối Supabase từ biến môi trường
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://supabase.co";
export const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Các trạng thái chung cho hệ thống
export enum Status {
  ACTIVE = "active",
  INACTIVE = "inactive",
  PENDING = "pending",
  COMPLETED = "completed",
  IN_PROGRESS = "in_progress",
  CANCELLED = "cancelled",
}

// Các trạng thái cho đơn hàng sản xuất
export enum ProductionOrderStatus {
  PENDING = "pending",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

// Các trạng thái cho sản phẩm hoàn thành
export enum QualityCheckStatus {
  PENDING = "pending",
  PASSED = "passed",
  FAILED = "failed",
}

export enum WarehouseStatus {
  PENDING = "pending",
  STOCKED = "stocked",
  DELIVERED = "delivered",
}

// Các ưu tiên cho đơn hàng sản xuất
export enum Priority {
  LOW = "low",
  NORMAL = "normal",
  HIGH = "high",
  URGENT = "urgent",
}

// Các vai trò người dùng
export enum UserRole {
  ADMIN = "admin",
  MANAGER = "manager",
  PRODUCTION = "production",
  WAREHOUSE = "warehouse",
  HR = "hr",
  QUALITY = "quality",
}

// Các trạng thái cho kho vải
export enum FabricStatus {
  AVAILABLE = "available",
  RESERVED = "reserved",
  IN_USE = "in_use", 
  USED = "used",
}

// Cấp chất lượng vải
export enum FabricQualityGrade {
  A = "A",
  B = "B",
  C = "C",
  D = "D",
}

// Trạng thái kiểm kê
export enum InventoryCheckStatus {
  DRAFT = "draft",
  IN_PROGRESS = "in-progress",
  COMPLETED = "completed",
}

// Các bảng Supabase
export const TABLES = {
  FABRICS: "fabrics",
  FABRIC_INVENTORY: "fabric_inventory",
  CUTTING_ORDERS: "cutting_orders",
  CUTTING_ORDER_DETAILS: "cutting_order_details",
  FABRIC_ISSUES: "fabric_issues",
  FABRIC_ISSUE_ITEMS: "fabric_issue_items",
  INVENTORY_CHECKS: "inventory_checks",
  INVENTORY_CHECK_ITEMS: "inventory_check_items",
  SUPPLIERS: "suppliers",
  EMPLOYEES: "employees",
  QUALITY_CONTROL_RECORDS: "quality_control_records",
  QUALITY_DEFECTS: "quality_defects",
  WAREHOUSES: "warehouses",
  PRODUCTION_ORDERS: "production_orders"
};
