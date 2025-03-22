export const resources = [
  {
    name: "dashboard",
    list: "/",
    meta: {
      label: "Tổng quan",
      icon: "home"
    }
  },
  {
    name: "users",
    list: "/users",
    meta: {
      label: "Quản lý người dùng",
      icon: "users",
      description: "Quản lý tài khoản người dùng và phân quyền",
      canDelete: false,
      accessControl: {
        roles: ["admin"]
      }
    }
  },
  {
    name: "settings",
    list: "/settings",
    meta: {
      label: "Cài đặt hệ thống",
      icon: "settings",
      description: "Cấu hình và thiết lập hệ thống",
      canDelete: false,
      accessControl: {
        roles: ["admin"]
      }
    }
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
      icon: "suppliers",
      canDelete: true,
    }
  },
  {
    name: "materials",
    list: "/materials",
    meta: {
      label: "Nguyên phụ liệu",
      icon: "materials",
      canDelete: true,
    }
  },
  {
    name: "products",
    list: "/products",
    meta: {
      label: "Sản phẩm",
      icon: "products",
      canDelete: true,
    }
  },
  {
    name: "product-standards",
    list: "/product-standards",
    meta: {
      label: "Định mức sản phẩm",
      icon: "production",
    }
  },
  {
    name: "production-orders",
    list: "/production-orders",
    meta: {
      label: "Đơn hàng sản xuất",
      icon: "orders",
    }
  },
  {
    name: "production-stages",
    list: "/production-stages",
    meta: {
      label: "Công đoạn sản xuất",
      icon: "production",
    }
  },
  {
    name: "production-progress",
    list: "/production-progress",
    meta: {
      label: "Tiến độ sản xuất",
      icon: "production",
    }
  },
  {
    name: "finished-products",
    list: "/finished-products",
    meta: {
      label: "Thành phẩm",
      icon: "products",
    }
  },
  {
    name: "employees",
    list: "/employees",
    meta: {
      label: "Nhân viên",
      icon: "users",
      canDelete: true,
    }
  },
  {
    name: "material-receipts",
    list: "/material-receipts",
    meta: {
      label: "Nhập nguyên phụ liệu",
      icon: "inventory",
    }
  },
  {
    name: "material-issues",
    list: "/material-issues",
    meta: {
      label: "Xuất nguyên phụ liệu",
      icon: "inventory",
    }
  },
  {
    name: "employee-productivity",
    list: "/employee-productivity",
    meta: {
      label: "Năng suất nhân viên",
      icon: "reports",
    }
  },
  {
    name: "website",
    list: "/website",
    meta: {
      label: "Website",
      icon: "globe",
      description: "Quản lý nội dung và thông tin website",
      canDelete: false
    }
  },
  {
    name: "website-info",
    list: "/website/info",
    meta: {
      label: "Thông tin",
      parent: "website",
      canDelete: false
    }
  },
  {
    name: "website-banners",
    list: "/website/banners",
    meta: {
      label: "Banner",
      parent: "website",
      canDelete: true
    }
  },
  {
    name: "website-pages",
    list: "/website/pages",
    meta: {
      label: "Trang",
      parent: "website",
      canDelete: true
    }
  },
  {
    name: "website-blog",
    list: "/website/blog",
    meta: {
      label: "Blog & Tin tức",
      parent: "website",
      canDelete: true
    }
  },
  {
    name: "website-customers",
    list: "/website/customers",
    meta: {
      label: "Khách hàng",
      parent: "website",
      canDelete: true
    }
  },
  {
    name: "website-testimonials",
    list: "/website/testimonials",
    meta: {
      label: "Đánh giá",
      parent: "website",
      canDelete: true
    }
  },
  {
    name: "website-contacts",
    list: "/website/contacts",
    meta: {
      label: "Liên hệ",
      parent: "website",
      canDelete: true
    }
  },
  {
    name: "website-jobs",
    list: "/website/jobs",
    meta: {
      label: "Tuyển dụng",
      parent: "website",
      canDelete: true
    }
  },
  {
    name: "website-settings",
    list: "/website/settings",
    meta: {
      label: "Cài đặt",
      parent: "website",
      canDelete: false
    }
  },
]; 