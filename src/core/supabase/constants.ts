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
  ADMIN = "admin",          // Quản trị viên - quyền cao nhất
  MANAGER = "manager",      // Quản lý - quản lý chung nhưng không thể đổi cấu hình hệ thống
  INVENTORY = "inventory",  // Nhân viên kho - chỉ quản lý kho và nguyên vật liệu
  PRODUCTION = "production", // Nhân viên sản xuất - quản lý quy trình sản xuất 
  SALES = "sales",          // Nhân viên kinh doanh - quản lý đơn hàng và khách hàng
  STAFF = "staff",          // Nhân viên thông thường - chỉ xem và thực hiện các tác vụ cơ bản
  GUEST = "guest"           // Khách - chỉ xem một số thông tin công khai
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

// Định nghĩa quyền thao tác trong hệ thống
export enum Permission {
  // Quyền chung
  VIEW = "view",           // Xem thông tin
  CREATE = "create",       // Tạo mới
  EDIT = "edit",           // Chỉnh sửa
  DELETE = "delete",       // Xóa
  EXPORT = "export",       // Xuất dữ liệu
  
  // Quyền đặc biệt
  APPROVE = "approve",     // Phê duyệt (đơn hàng, yêu cầu...)
  REJECT = "reject",       // Từ chối 
  MANAGE_USERS = "manage_users", // Quản lý người dùng
  CONFIGURE_SYSTEM = "configure_system" // Cấu hình hệ thống
}

// Định nghĩa ánh xạ vai trò - quyền
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: [
    Permission.VIEW, Permission.CREATE, Permission.EDIT, Permission.DELETE, 
    Permission.EXPORT, Permission.APPROVE, Permission.REJECT,
    Permission.MANAGE_USERS, Permission.CONFIGURE_SYSTEM
  ],
  [UserRole.MANAGER]: [
    Permission.VIEW, Permission.CREATE, Permission.EDIT, Permission.DELETE,
    Permission.EXPORT, Permission.APPROVE, Permission.REJECT
  ],
  [UserRole.INVENTORY]: [
    Permission.VIEW, Permission.CREATE, Permission.EDIT, 
    Permission.EXPORT, Permission.APPROVE, Permission.REJECT
  ],
  [UserRole.PRODUCTION]: [
    Permission.VIEW, Permission.CREATE, Permission.EDIT, 
    Permission.EXPORT, Permission.APPROVE, Permission.REJECT
  ],
  [UserRole.SALES]: [
    Permission.VIEW, Permission.CREATE, Permission.EDIT,
    Permission.EXPORT, Permission.APPROVE, Permission.REJECT
  ],
  [UserRole.STAFF]: [
    Permission.VIEW, Permission.CREATE,
    Permission.EXPORT
  ],
  [UserRole.GUEST]: [
    Permission.VIEW
  ]
};

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
