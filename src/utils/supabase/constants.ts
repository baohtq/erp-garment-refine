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
