import { supabaseBrowserClient } from "@/utils/supabase/client";
import { TABLES } from "@/utils/supabase/constants";
import { CuttingOrder, CuttingOrderDetail, FabricIssue } from "@/types/fabric-management";

// Cache các lệnh cắt với thời gian 10 phút
let cuttingOrdersCache: {
  data: CuttingOrder[] | null;
  timestamp: number;
  expiresAt: number;
} = {
  data: null,
  timestamp: 0,
  expiresAt: 0
};

// Thời gian cache (10 phút)
const CACHE_DURATION = 10 * 60 * 1000;

/**
 * Lấy tất cả lệnh cắt, sắp xếp theo ngày kế hoạch
 */
export async function getAllCuttingOrders(): Promise<CuttingOrder[]> {
  // Kiểm tra cache
  const now = Date.now();
  if (cuttingOrdersCache.data && now < cuttingOrdersCache.expiresAt) {
    console.log('Using cached cutting orders');
    return cuttingOrdersCache.data;
  }

  try {
    const { data, error } = await supabaseBrowserClient
      .from(TABLES.CUTTING_ORDERS)
      .select('*')
      .order('planned_date', { ascending: false });

    if (error) {
      console.error('Error fetching cutting orders:', error);
      throw error;
    }

    // Cập nhật cache
    cuttingOrdersCache = {
      data,
      timestamp: now,
      expiresAt: now + CACHE_DURATION
    };

    return data;
  } catch (error) {
    console.error('Failed to fetch cutting orders:', error);
    throw error;
  }
}

/**
 * Lấy lệnh cắt theo trạng thái
 */
export async function getCuttingOrdersByStatus(status: string): Promise<CuttingOrder[]> {
  try {
    // Kiểm tra cache trước
    const now = Date.now();
    if (cuttingOrdersCache.data && now < cuttingOrdersCache.expiresAt) {
      const filteredOrders = cuttingOrdersCache.data.filter(order => order.status === status);
      return filteredOrders;
    }

    const { data, error } = await supabaseBrowserClient
      .from(TABLES.CUTTING_ORDERS)
      .select('*')
      .eq('status', status)
      .order('planned_date', { ascending: false });

    if (error) {
      console.error(`Error fetching cutting orders with status ${status}:`, error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error(`Failed to fetch cutting orders with status ${status}:`, error);
    throw error;
  }
}

/**
 * Lấy lệnh cắt theo ID
 */
export async function getCuttingOrderById(id: number): Promise<CuttingOrder | null> {
  try {
    // Kiểm tra cache trước
    const now = Date.now();
    if (cuttingOrdersCache.data && now < cuttingOrdersCache.expiresAt) {
      const order = cuttingOrdersCache.data.find(order => order.id === id);
      if (order) return order;
    }

    const { data, error } = await supabaseBrowserClient
      .from(TABLES.CUTTING_ORDERS)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching cutting order with id ${id}:`, error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error(`Failed to fetch cutting order with id ${id}:`, error);
    throw error;
  }
}

/**
 * Lấy phiếu xuất vải theo lệnh cắt
 */
export async function getFabricIssuesByCuttingOrder(cuttingOrderId: number): Promise<FabricIssue[]> {
  try {
    const { data, error } = await supabaseBrowserClient
      .from(TABLES.FABRIC_ISSUES)
      .select('*')
      .eq('cutting_order_id', cuttingOrderId)
      .order('issue_date', { ascending: false });

    if (error) {
      console.error(`Error fetching fabric issues for cutting order ${cuttingOrderId}:`, error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error(`Failed to fetch fabric issues for cutting order ${cuttingOrderId}:`, error);
    throw error;
  }
}

/**
 * Tạo lệnh cắt mới
 */
export async function createCuttingOrder(cuttingOrder: Omit<CuttingOrder, 'id' | 'created_at' | 'updated_at'>): Promise<CuttingOrder> {
  try {
    // Thêm ngày tạo và cập nhật
    const orderWithTimestamps = {
      ...cuttingOrder,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabaseBrowserClient
      .from(TABLES.CUTTING_ORDERS)
      .insert(orderWithTimestamps)
      .select()
      .single();

    if (error) {
      console.error('Error creating cutting order:', error);
      throw error;
    }

    // Cập nhật cache nếu có
    if (cuttingOrdersCache.data) {
      cuttingOrdersCache.data = [data, ...cuttingOrdersCache.data];
    }

    return data;
  } catch (error) {
    console.error('Failed to create cutting order:', error);
    throw error;
  }
}

/**
 * Cập nhật lệnh cắt
 */
export async function updateCuttingOrder(id: number, cuttingOrder: Partial<CuttingOrder>): Promise<CuttingOrder> {
  try {
    // Thêm thời gian cập nhật
    const updates = {
      ...cuttingOrder,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabaseBrowserClient
      .from(TABLES.CUTTING_ORDERS)
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating cutting order ${id}:`, error);
      throw error;
    }

    // Cập nhật cache nếu có
    if (cuttingOrdersCache.data) {
      cuttingOrdersCache.data = cuttingOrdersCache.data.map(order => 
        order.id === id ? { ...order, ...updates } : order
      );
    }

    return data;
  } catch (error) {
    console.error(`Failed to update cutting order ${id}:`, error);
    throw error;
  }
}

/**
 * Cập nhật trạng thái của lệnh cắt
 */
export async function updateCuttingOrderStatus(id: number, status: string): Promise<CuttingOrder> {
  return updateCuttingOrder(id, { status });
}

/**
 * Xóa lệnh cắt
 */
export async function deleteCuttingOrder(id: number): Promise<void> {
  try {
    const { error } = await supabaseBrowserClient
      .from(TABLES.CUTTING_ORDERS)
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Error deleting cutting order ${id}:`, error);
      throw error;
    }

    // Cập nhật cache nếu có
    if (cuttingOrdersCache.data) {
      cuttingOrdersCache.data = cuttingOrdersCache.data.filter(order => order.id !== id);
    }
  } catch (error) {
    console.error(`Failed to delete cutting order ${id}:`, error);
    throw error;
  }
}

/**
 * Làm mới cache
 */
export function invalidateCuttingOrdersCache(): void {
  cuttingOrdersCache = {
    data: null,
    timestamp: 0,
    expiresAt: 0
  };
}

/**
 * Lấy tất cả chi tiết của một lệnh cắt
 */
export const getCuttingOrderDetails = async (cuttingOrderId: number): Promise<CuttingOrderDetail[]> => {
  try {
    const { data, error } = await supabaseBrowserClient
      .from(TABLES.CUTTING_ORDER_DETAILS)
      .select(`
        *,
        fabrics:fabric_id(name)
      `)
      .eq('cutting_order_id', cuttingOrderId)
      .order('id');

    if (error) {
      console.error(`Error fetching cutting order details for order id ${cuttingOrderId}:`, error);
      throw error;
    }

    // Chuyển đổi dữ liệu để phù hợp với định dạng hiện tại
    const details = data.map(detail => ({
      ...detail,
      fabric_name: detail.fabrics?.name
    }));

    return details;
  } catch (error) {
    console.error("Error in getCuttingOrderDetails:", error);
    throw error;
  }
};

/**
 * Thêm mới một chi tiết lệnh cắt
 */
export const createCuttingOrderDetail = async (detail: Omit<CuttingOrderDetail, 'id' | 'created_at' | 'updated_at'>): Promise<CuttingOrderDetail> => {
  try {
    const { data, error } = await supabaseBrowserClient
      .from(TABLES.CUTTING_ORDER_DETAILS)
      .insert([{
        ...detail,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error("Error creating cutting order detail:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error in createCuttingOrderDetail:", error);
    throw error;
  }
};

/**
 * Cập nhật thông tin chi tiết lệnh cắt
 */
export const updateCuttingOrderDetail = async (id: number, detail: Partial<CuttingOrderDetail>): Promise<CuttingOrderDetail> => {
  try {
    const { data, error } = await supabaseBrowserClient
      .from(TABLES.CUTTING_ORDER_DETAILS)
      .update({
        ...detail,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error("Error updating cutting order detail:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error in updateCuttingOrderDetail:", error);
    throw error;
  }
};

/**
 * Cập nhật sử dụng vải trong chi tiết lệnh cắt
 */
export const updateFabricConsumption = async (
  detailId: number, 
  actualConsumed: number, 
  wasteLength: number
): Promise<CuttingOrderDetail> => {
  try {
    const wastePercent = actualConsumed > 0 ? (wasteLength / actualConsumed) * 100 : 0;
    
    const { data, error } = await supabaseBrowserClient
      .from(TABLES.CUTTING_ORDER_DETAILS)
      .update({
        actual_consumed_length: actualConsumed,
        waste_length: wasteLength,
        waste_percent: wastePercent,
        updated_at: new Date().toISOString()
      })
      .eq('id', detailId)
      .select()
      .single();

    if (error) {
      console.error("Error updating fabric consumption:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error in updateFabricConsumption:", error);
    throw error;
  }
}; 