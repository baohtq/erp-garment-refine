import { supabaseBrowserClient } from "@/utils/supabase/client";
import { TABLES } from "@/utils/supabase/constants";
import { InventoryCheck, InventoryCheckItem } from "@/types/fabric-management";

// Cache kiểm kê kho với thời gian 5 phút
let inventoryChecksCache: {
  data: InventoryCheck[] | null;
  timestamp: number;
  expiresAt: number;
} = {
  data: null,
  timestamp: 0,
  expiresAt: 0
};

// Thời gian cache (5 phút)
const CACHE_DURATION = 5 * 60 * 1000;

/**
 * Lấy tất cả phiếu kiểm kê kho
 */
export async function getAllInventoryChecks(): Promise<InventoryCheck[]> {
  // Kiểm tra cache
  const now = Date.now();
  if (inventoryChecksCache.data && now < inventoryChecksCache.expiresAt) {
    console.log('Using cached inventory checks');
    return inventoryChecksCache.data;
  }

  try {
    const { data, error } = await supabaseBrowserClient
      .from(TABLES.INVENTORY_CHECKS)
      .select('*')
      .order('check_date', { ascending: false });

    if (error) {
      console.error('Error fetching inventory checks:', error);
      throw error;
    }

    // Cập nhật cache
    inventoryChecksCache = {
      data,
      timestamp: now,
      expiresAt: now + CACHE_DURATION
    };

    return data;
  } catch (error) {
    console.error('Failed to fetch inventory checks:', error);
    throw error;
  }
}

/**
 * Lấy phiếu kiểm kê theo trạng thái
 */
export async function getInventoryChecksByStatus(status: string): Promise<InventoryCheck[]> {
  try {
    // Kiểm tra cache trước
    const now = Date.now();
    if (inventoryChecksCache.data && now < inventoryChecksCache.expiresAt) {
      const filteredChecks = inventoryChecksCache.data.filter(check => check.status === status);
      return filteredChecks;
    }

    const { data, error } = await supabaseBrowserClient
      .from(TABLES.INVENTORY_CHECKS)
      .select('*')
      .eq('status', status)
      .order('check_date', { ascending: false });

    if (error) {
      console.error(`Error fetching inventory checks with status ${status}:`, error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error(`Failed to fetch inventory checks with status ${status}:`, error);
    throw error;
  }
}

/**
 * Lấy phiếu kiểm kê theo ID
 */
export async function getInventoryCheckById(id: number): Promise<InventoryCheck | null> {
  try {
    // Kiểm tra cache trước
    const now = Date.now();
    if (inventoryChecksCache.data && now < inventoryChecksCache.expiresAt) {
      const check = inventoryChecksCache.data.find(check => check.id === id);
      if (check) return check;
    }

    const { data, error } = await supabaseBrowserClient
      .from(TABLES.INVENTORY_CHECKS)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching inventory check with id ${id}:`, error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error(`Failed to fetch inventory check with id ${id}:`, error);
    throw error;
  }
}

/**
 * Lấy các mục kiểm kê theo ID phiếu kiểm kê
 */
export async function getInventoryCheckItems(checkId: number): Promise<InventoryCheckItem[]> {
  try {
    const { data, error } = await supabaseBrowserClient
      .from(TABLES.INVENTORY_CHECK_ITEMS)
      .select(`
        *,
        inventory:inventory_id(roll_code),
        fabric:fabric_inventory(fabric_id(name, code))
      `)
      .eq('inventory_check_id', checkId);

    if (error) {
      console.error(`Error fetching inventory check items for check ${checkId}:`, error);
      throw error;
    }

    // Chuyển đổi dữ liệu
    return data.map(item => ({
      ...item,
      inventory_roll_code: item.inventory?.roll_code,
      fabric_name: item.fabric?.fabric_id?.name,
      fabric_code: item.fabric?.fabric_id?.code
    }));
  } catch (error) {
    console.error(`Failed to fetch inventory check items for check ${checkId}:`, error);
    throw error;
  }
}

/**
 * Tạo phiếu kiểm kê mới
 */
export async function createInventoryCheck(
  check: Omit<InventoryCheck, 'id' | 'created_at' | 'updated_at'>
): Promise<InventoryCheck> {
  try {
    // Thêm ngày tạo và cập nhật
    const checkWithTimestamps = {
      ...check,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabaseBrowserClient
      .from(TABLES.INVENTORY_CHECKS)
      .insert(checkWithTimestamps)
      .select()
      .single();

    if (error) {
      console.error('Error creating inventory check:', error);
      throw error;
    }

    // Cập nhật cache nếu có
    if (inventoryChecksCache.data) {
      inventoryChecksCache.data = [data, ...inventoryChecksCache.data];
    }

    return data;
  } catch (error) {
    console.error('Failed to create inventory check:', error);
    throw error;
  }
}

/**
 * Thêm mục kiểm kê
 */
export async function addInventoryCheckItem(item: Omit<InventoryCheckItem, 'id' | 'created_at' | 'updated_at'>): Promise<InventoryCheckItem> {
  try {
    // Thêm ngày tạo và cập nhật
    const itemWithTimestamps = {
      ...item,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabaseBrowserClient
      .from(TABLES.INVENTORY_CHECK_ITEMS)
      .insert(itemWithTimestamps)
      .select()
      .single();

    if (error) {
      console.error('Error adding inventory check item:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to add inventory check item:', error);
    throw error;
  }
}

/**
 * Cập nhật phiếu kiểm kê
 */
export async function updateInventoryCheck(id: number, check: Partial<InventoryCheck>): Promise<InventoryCheck> {
  try {
    // Thêm thời gian cập nhật
    const updates = {
      ...check,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabaseBrowserClient
      .from(TABLES.INVENTORY_CHECKS)
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating inventory check ${id}:`, error);
      throw error;
    }

    // Cập nhật cache nếu có
    if (inventoryChecksCache.data) {
      inventoryChecksCache.data = inventoryChecksCache.data.map(check => 
        check.id === id ? { ...check, ...updates } : check
      );
    }

    return data;
  } catch (error) {
    console.error(`Failed to update inventory check ${id}:`, error);
    throw error;
  }
}

/**
 * Cập nhật mục kiểm kê
 */
export async function updateInventoryCheckItem(id: number, item: Partial<InventoryCheckItem>): Promise<InventoryCheckItem> {
  try {
    // Thêm thời gian cập nhật
    const updates = {
      ...item,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabaseBrowserClient
      .from(TABLES.INVENTORY_CHECK_ITEMS)
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating inventory check item ${id}:`, error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error(`Failed to update inventory check item ${id}:`, error);
    throw error;
  }
}

/**
 * Cập nhật nhiều mục kiểm kê cùng lúc
 */
export async function updateInventoryCheckItems(items: { id: number; actual_length: number; actual_weight: number; status: string }[]): Promise<void> {
  try {
    // Tạo các cập nhật với thời gian
    const updates = items.map(item => ({
      id: item.id,
      actual_length: item.actual_length,
      actual_weight: item.actual_weight,
      status: item.status,
      updated_at: new Date().toISOString()
    }));

    const { error } = await supabaseBrowserClient
      .from(TABLES.INVENTORY_CHECK_ITEMS)
      .upsert(updates);

    if (error) {
      console.error('Error updating inventory check items:', error);
      throw error;
    }
  } catch (error) {
    console.error('Failed to update inventory check items:', error);
    throw error;
  }
}

/**
 * Hoàn thành phiếu kiểm kê
 * Cập nhật trạng thái phiếu kiểm kê và đồng bộ lại dữ liệu kho
 */
export async function completeInventoryCheck(id: number, approvedById?: number): Promise<InventoryCheck> {
  try {
    // Gọi stored function để hoàn thành kiểm kê
    const { data, error } = await supabaseBrowserClient
      .rpc('complete_inventory_check', {
        check_id: id,
        approved_by_id: approvedById
      });

    if (error) {
      console.error(`Error completing inventory check ${id}:`, error);
      throw error;
    }

    // Cập nhật cache nếu có
    if (inventoryChecksCache.data) {
      inventoryChecksCache.data = inventoryChecksCache.data.map(check => 
        check.id === id ? { ...check, status: 'completed', approved_by: approvedById } : check
      );
    }

    return data;
  } catch (error) {
    console.error(`Failed to complete inventory check ${id}:`, error);
    throw error;
  }
}

/**
 * Xóa phiếu kiểm kê
 */
export async function deleteInventoryCheck(id: number): Promise<void> {
  try {
    const { error } = await supabaseBrowserClient
      .from(TABLES.INVENTORY_CHECKS)
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Error deleting inventory check ${id}:`, error);
      throw error;
    }

    // Cập nhật cache nếu có
    if (inventoryChecksCache.data) {
      inventoryChecksCache.data = inventoryChecksCache.data.filter(check => check.id !== id);
    }
  } catch (error) {
    console.error(`Failed to delete inventory check ${id}:`, error);
    throw error;
  }
}

/**
 * Làm mới cache
 */
export function invalidateInventoryChecksCache(): void {
  inventoryChecksCache = {
    data: null,
    timestamp: 0,
    expiresAt: 0
  };
} 