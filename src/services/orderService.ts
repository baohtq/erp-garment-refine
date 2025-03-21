import { useOne, useMany, useCreate, useUpdate, useList, BaseRecord } from "@refinedev/core";

// Types
export interface OrderItem {
  id: number | string;
  product: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  totalPrice?: number;
}

export interface Order extends BaseRecord {
  id: string;
  orderNumber?: string;
  customer: {
    id?: string;
    name: string;
    email?: string;
    phone?: string;
    address?: string;
  };
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  totalAmount: number;
  createdAt: string;
  deliveryDate?: string;
  notes?: string;
  items: OrderItem[];
  paymentStatus?: 'unpaid' | 'partial' | 'paid';
  paymentMethod?: string;
  paymentHistory?: {
    id: string;
    amount: number;
    date: string;
    method: string;
  }[];
}

// Configuration for status and payment status
export const statusConfig: Record<string, { color: string; text: string }> = {
  pending: { color: "bg-orange-100 text-orange-800", text: "Chờ xử lý" },
  processing: { color: "bg-blue-100 text-blue-800", text: "Đang xử lý" },
  completed: { color: "bg-green-100 text-green-800", text: "Hoàn thành" },
  cancelled: { color: "bg-red-100 text-red-800", text: "Đã hủy" },
};

export const paymentStatusConfig: Record<string, { color: string; text: string }> = {
  unpaid: { color: "bg-red-100 text-red-800", text: "Chưa thanh toán" },
  partial: { color: "bg-yellow-100 text-yellow-800", text: "Thanh toán một phần" },
  paid: { color: "bg-green-100 text-green-800", text: "Đã thanh toán" },
};

// Helper functions
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('vi-VN');
};

// Mock data generator
export const generateMockOrders = (count: number = 10): Order[] => {
  return Array(count).fill(0).map((_, index) => ({
    id: `${index + 1}`,
    orderNumber: `PO-2023-${String(index + 1).padStart(3, '0')}`,
    customer: { 
      id: `CUST-${index + 1}`, 
      name: `Khách hàng ${index + 1}` 
    },
    status: ['pending', 'processing', 'completed', 'cancelled'][Math.floor(Math.random() * 4)] as Order['status'],
    totalAmount: Math.floor(Math.random() * 10000000) + 1000000,
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
    paymentStatus: ['unpaid', 'partial', 'paid'][Math.floor(Math.random() * 3)] as 'unpaid' | 'partial' | 'paid',
    items: Array(Math.floor(Math.random() * 3) + 1).fill(0).map((_, itemIndex) => ({
      id: `ITEM-${index}-${itemIndex}`,
      product: `Sản phẩm ${itemIndex + 1}`,
      sku: `SKU-${index}-${itemIndex}`,
      quantity: Math.floor(Math.random() * 100) + 1,
      unitPrice: (Math.floor(Math.random() * 20) + 1) * 10000,
    })),
  }));
};

export const generateMockOrderDetail = (id: string): Order => {
  return {
    id,
    orderNumber: `PO-2023-${id.padStart(3, '0')}`,
    customer: { 
      id: "CUST-001", 
      name: "Công ty May mặc ABC", 
      email: "contact@abcgarment.com",
      phone: "0987654321",
      address: "123 Đường Lê Lợi, Quận 1, TP. Hồ Chí Minh"
    },
    status: "processing",
    totalAmount: 87500000,
    createdAt: new Date().toISOString(),
    deliveryDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    notes: "Đơn hàng cần giao trước ngày 30/7/2023",
    items: [
      { 
        id: "ITEM-001", 
        product: "Áo sơ mi nam", 
        sku: "SM-NAM-001", 
        quantity: 500, 
        unitPrice: 85000, 
        totalPrice: 42500000 
      },
      { 
        id: "ITEM-002", 
        product: "Quần âu nam", 
        sku: "QA-NAM-001", 
        quantity: 300, 
        unitPrice: 150000, 
        totalPrice: 45000000 
      }
    ],
    paymentStatus: "partial",
    paymentMethod: "banking",
    paymentHistory: [
      { id: "PMT-001", amount: 30000000, date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), method: "Chuyển khoản" }
    ]
  };
};

// Lấy danh sách đơn hàng với fallback về mock data
export const useOrderList = (
  filters?: any, 
  sorters?: any, 
  pagination?: { current: number, pageSize: number }
) => {
  const { data, isLoading, isError } = useList({
    resource: "orders",
    filters,
    sorters,
    pagination,
    meta: {
      retry: false // Không retry nếu API fail
    }
  });

  // Mock data fallback
  const mockData = generateMockOrders();
  
  // Trả về dữ liệu API nếu có, nếu không thì dùng mock data
  const orders = isError || !data?.data ? mockData : data.data;
  const total = isError || !data?.total ? mockData.length : data.total;

  return {
    orders,
    total,
    isLoading,
    isError
  };
};

// Lấy chi tiết đơn hàng với fallback về mock data
export const useOrderDetail = (id: string) => {
  const { data, isLoading, isError } = useOne({
    resource: "orders",
    id,
    meta: {
      retry: false
    },
    errorNotification: (error) => {
      console.error(`Error fetching order detail for ID ${id}:`, error);
      return { message: "Lỗi khi tải dữ liệu đơn hàng", type: "error" };
    }
  });

  // Mock data fallback
  const mockData = generateMockOrderDetail(id);
  
  // Trả về dữ liệu API nếu có, nếu không thì dùng mock data
  const order = isError || !data?.data ? mockData : data.data;

  return {
    order,
    isLoading,
    isError
  };
};

// Tính toán tổng tiền từ items
export const calculateOrderTotal = (items: OrderItem[]) => {
  return items.reduce((total, item) => {
    const itemTotal = Number(item.quantity) * Number(item.unitPrice);
    return total + itemTotal;
  }, 0);
};

// Tạo mới đơn hàng với kiểm tra kết nối API
export const useCreateOrder = () => {
  const { mutate, isLoading } = useCreate();

  return {
    createOrder: (values: any) => {
      return mutate({
        resource: "orders",
        values,
        errorNotification: (error) => {
          console.error("Error creating order:", error);
          return { message: "Lỗi khi tạo đơn hàng", type: "error" };
        }
      });
    },
    isLoading
  };
};

// Cập nhật đơn hàng với kiểm tra kết nối API
export const useUpdateOrder = () => {
  const { mutate, isLoading } = useUpdate();

  return {
    updateOrder: (id: string, values: any) => {
      return mutate({
        resource: "orders",
        id,
        values,
        errorNotification: (error) => {
          console.error("Error updating order:", error);
          return { message: "Lỗi khi cập nhật đơn hàng", type: "error" };
        }
      });
    },
    isLoading
  };
}; 