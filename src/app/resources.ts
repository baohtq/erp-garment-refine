import {
  HomeIcon,
  UserGroupIcon,
  ShoppingBagIcon,
  Cog6ToothIcon,
  TagIcon,
  ListBulletIcon,
  ArrowsPointingOutIcon,
  UsersIcon,
  DocumentTextIcon,
  ArrowsUpDownIcon,
  TruckIcon,
  ClipboardDocumentListIcon,
  BuildingStorefrontIcon,
  CheckCircleIcon,
  ChartBarIcon
} from "@heroicons/react/24/outline";
import React from "react";

// Các tài nguyên trong hệ thống
export const resources = [
  {
    name: "dashboard",
    list: "/",
    meta: {
      label: "Bảng điều khiển",
      icon: React.createElement(HomeIcon),
    },
  },
  {
    name: "orders",
    list: "/(protected)/orders",
    show: "/(protected)/orders/show/:id",
    create: "/(protected)/orders/create",
    edit: "/(protected)/orders/edit/:id",
    meta: {
      label: "Đơn hàng",
      icon: React.createElement(ClipboardDocumentListIcon),
    },
  },
  {
    name: "production",
    list: "/(protected)/production",
    show: "/(protected)/production/show/:id",
    create: "/(protected)/production/create",
    edit: "/(protected)/production/edit/:id",
    meta: {
      label: "Sản xuất",
      icon: React.createElement(TruckIcon),
    },
    children: [
      {
        name: "production-orders",
        list: "/(protected)/production/orders",
        show: "/(protected)/production/orders/show/:id",
        create: "/(protected)/production/orders/create",
        edit: "/(protected)/production/orders/edit/:id",
        meta: {
          label: "Đơn hàng sản xuất",
          parent: "production",
        },
      },
      {
        name: "production-stages",
        list: "/(protected)/production/stages",
        show: "/(protected)/production/stages/show/:id",
        create: "/(protected)/production/stages/create",
        edit: "/(protected)/production/stages/edit/:id",
        meta: {
          label: "Công đoạn sản xuất",
          parent: "production",
        },
      },
      {
        name: "production-progress",
        list: "/(protected)/production/progress",
        show: "/(protected)/production/progress/show/:id",
        create: "/(protected)/production/progress/create",
        edit: "/(protected)/production/progress/edit/:id",
        meta: {
          label: "Tiến độ sản xuất",
          parent: "production",
        },
      },
      {
        name: "finished-products",
        list: "/(protected)/production/finished-products",
        show: "/(protected)/production/finished-products/show/:id",
        create: "/(protected)/production/finished-products/create",
        edit: "/(protected)/production/finished-products/edit/:id",
        meta: {
          label: "Thành phẩm",
          parent: "production",
        },
      },
    ],
  },
  {
    name: "users",
    list: "/(protected)/users",
    show: "/(protected)/users/show/:id",
    create: "/(protected)/users/create",
    edit: "/(protected)/users/edit/:id",
    meta: {
      label: "Người dùng",
      icon: React.createElement(UserGroupIcon),
    },
  },
  {
    name: "products",
    list: "/(protected)/products",
    show: "/(protected)/products/show/:id",
    create: "/(protected)/products/create",
    edit: "/(protected)/products/edit/:id",
    meta: {
      label: "Sản phẩm",
      icon: React.createElement(ShoppingBagIcon),
    },
  },
  {
    name: "product-standards",
    list: "/(protected)/product-standards",
    show: "/(protected)/product-standards/show/:id",
    create: "/(protected)/product-standards/create",
    edit: "/(protected)/product-standards/edit/:id",
    meta: {
      label: "Tiêu chuẩn SP",
      icon: React.createElement(ArrowsUpDownIcon),
    },
  },
  {
    name: "materials",
    list: "/(protected)/materials",
    show: "/(protected)/materials/show/:id",
    create: "/(protected)/materials/create",
    edit: "/(protected)/materials/edit/:id",
    meta: {
      label: "Nguyên vật liệu",
      icon: React.createElement(DocumentTextIcon),
    },
    children: [
      {
        name: "material-categories",
        list: "/(protected)/materials/categories",
        create: "/(protected)/materials/categories/create",
        edit: "/(protected)/materials/categories/edit/:id",
        show: "/(protected)/materials/categories/show/:id",
        meta: {
          label: "Phân loại nguyên vật liệu",
          parent: "materials",
        },
      },
      {
        name: "material-import",
        list: "/(protected)/materials/import",
        create: "/(protected)/materials/import/create",
        edit: "/(protected)/materials/import/edit/:id",
        show: "/(protected)/materials/import/show/:id",
        meta: {
          label: "Nhập nguyên vật liệu",
          parent: "materials",
        },
      },
      {
        name: "material-export",
        list: "/(protected)/materials/export",
        create: "/(protected)/materials/export/create",
        edit: "/(protected)/materials/export/edit/:id",
        show: "/(protected)/materials/export/show/:id",
        meta: {
          label: "Xuất nguyên vật liệu",
          parent: "materials",
        },
      },
    ],
  },
  {
    name: "suppliers",
    list: "/(protected)/suppliers",
    show: "/(protected)/suppliers/show/:id",
    create: "/(protected)/suppliers/create",
    edit: "/(protected)/suppliers/edit/:id",
    meta: {
      label: "Nhà cung cấp",
      icon: React.createElement(UsersIcon),
    },
  },
  {
    name: "fabric-management",
    list: "/(protected)/fabric-management",
    show: "/(protected)/fabric-management/show/:id",
    create: "/(protected)/fabric-management/create",
    edit: "/(protected)/fabric-management/edit/:id",
    meta: {
      label: "Quản lý vải",
      icon: React.createElement(ArrowsPointingOutIcon),
    },
  },
  {
    name: "inventory",
    list: "/(protected)/inventory",
    show: "/(protected)/inventory/show/:id",
    create: "/(protected)/inventory/create",
    edit: "/(protected)/inventory/edit/:id",
    meta: {
      label: "Quản lý kho",
      icon: React.createElement(BuildingStorefrontIcon),
    },
  },
  {
    name: "employees",
    list: "/(protected)/employees",
    show: "/(protected)/employees/show/:id",
    create: "/(protected)/employees/create",
    edit: "/(protected)/employees/edit/:id",
    meta: {
      label: "Nhân viên",
      icon: React.createElement(UsersIcon),
    },
    children: [
      {
        name: "employee-performance",
        list: "/(protected)/employees/performance",
        show: "/(protected)/employees/performance/show/:id",
        create: "/(protected)/employees/performance/create",
        edit: "/(protected)/employees/performance/edit/:id",
        meta: {
          label: "Năng suất nhân viên",
          parent: "employees",
        },
      },
    ],
  },
  {
    name: "quality",
    list: "/(protected)/quality",
    show: "/(protected)/quality/show/:id",
    create: "/(protected)/quality/create",
    edit: "/(protected)/quality/edit/:id",
    meta: {
      label: "Quản lý chất lượng",
      icon: React.createElement(CheckCircleIcon),
    },
  },
  {
    name: "reports",
    list: "/(protected)/reports",
    show: "/(protected)/reports/show/:id",
    meta: {
      label: "Báo cáo",
      icon: React.createElement(ChartBarIcon),
    },
  },
  {
    name: "categories",
    list: "/(protected)/categories",
    show: "/(protected)/categories/show/:id",
    create: "/(protected)/categories/create",
    edit: "/(protected)/categories/edit/:id",
    meta: {
      label: "Danh mục",
      icon: React.createElement(TagIcon),
    },
  },
  {
    name: "settings",
    list: "/(protected)/settings",
    meta: {
      label: "Cài đặt",
      icon: React.createElement(Cog6ToothIcon),
    },
  },
]; 