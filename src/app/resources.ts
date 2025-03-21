export const resources = [
  {
    name: "dashboard",
    list: "/",
  },
  {
    name: "fabrics",
    list: "/fabric-management",
    meta: {
      label: "Vải",
      icon: "fabric",
      canDelete: true,
    }
  },
  {
    name: "fabric_inventory",
    list: "/fabric-management",
    meta: {
      label: "Kho vải",
      parent: "fabrics",
      canDelete: true,
    }
  },
  {
    name: "cutting_orders",
    list: "/fabric-management",
    meta: {
      label: "Lệnh cắt",
      parent: "fabrics",
    }
  },
  {
    name: "fabric_issues",
    list: "/fabric-management",
    meta: {
      label: "Phát vải",
      parent: "fabrics",
    }
  },
  {
    name: "inventory_checks",
    list: "/fabric-management",
    meta: {
      label: "Kiểm kê",
      parent: "fabrics",
    }
  },
  {
    name: "suppliers",
    list: "/suppliers",
    meta: {
      label: "Nhà cung cấp",
      canDelete: true,
    }
  },
  {
    name: "materials",
    list: "/materials",
    meta: {
      label: "Nguyên phụ liệu",
      canDelete: true,
    }
  },
  {
    name: "products",
    list: "/products",
    meta: {
      label: "Sản phẩm",
      canDelete: true,
    }
  },
  {
    name: "product-standards",
    list: "/product-standards",
    meta: {
      label: "Định mức sản phẩm",
    }
  },
  {
    name: "production-orders",
    list: "/production-orders",
    meta: {
      label: "Đơn hàng sản xuất",
    }
  },
  {
    name: "production-stages",
    list: "/production-stages",
    meta: {
      label: "Công đoạn sản xuất",
    }
  },
  {
    name: "production-progress",
    list: "/production-progress",
    meta: {
      label: "Tiến độ sản xuất",
    }
  },
  {
    name: "finished-products",
    list: "/finished-products",
    meta: {
      label: "Thành phẩm",
    }
  },
  {
    name: "employees",
    list: "/employees",
    meta: {
      label: "Nhân viên",
      canDelete: true,
    }
  },
  {
    name: "material-receipts",
    list: "/material-receipts",
    meta: {
      label: "Nhập nguyên phụ liệu",
    }
  },
  {
    name: "material-issues",
    list: "/material-issues",
    meta: {
      label: "Xuất nguyên phụ liệu",
    }
  },
  {
    name: "employee-productivity",
    list: "/employee-productivity",
    meta: {
      label: "Năng suất nhân viên",
    }
  },
]; 