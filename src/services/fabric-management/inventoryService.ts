import { supabaseBrowserClient } from "@/utils/supabase/client";
import { TABLES } from "@/utils/supabase/constants";
import { FabricInventory, mockInventory } from "@/mocks/fabric-management.mock";

/**
 * Lấy danh sách tất cả các mục trong kho
 */
export const getAllInventory = async (): Promise<FabricInventory[]> => {
  try {
    try {
      const { data, error } = await supabaseBrowserClient
        .from(TABLES.FABRIC_INVENTORY)
        .select(`
          *,
          fabrics:${TABLES.FABRICS}(name)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching inventory:", error);
        throw error;
      }

      // Chuyển đổi dữ liệu để phù hợp với định dạng hiện tại
      const inventoryWithFabricName = data.map(item => {
        const typedItem = item as any;
        return {
          ...typedItem,
          fabric_name: typedItem.fabrics?.name || ''
        };
      });

      return inventoryWithFabricName;
    } catch (apiError) {
      console.error("Failed to fetch from API, using mock data:", apiError);
      // Fallback to mock data
      return mockInventory;
    }
  } catch (error) {
    console.error("Error in getAllInventory:", error);
    // Final fallback
    return mockInventory;
  }
};

/**
 * Lấy danh sách các mục trong kho theo trạng thái
 */
export const getInventoryByStatus = async (status: string): Promise<FabricInventory[]> => {
  try {
    const { data, error } = await supabaseBrowserClient
      .from(TABLES.FABRIC_INVENTORY)
      .select(`
        *,
        fabrics:${TABLES.FABRICS}(name)
      `)
      .eq('status', status)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(`Error fetching inventory with status ${status}:`, error);
      throw error;
    }

    // Chuyển đổi dữ liệu để phù hợp với định dạng hiện tại
    const inventoryWithFabricName = data.map(item => {
      const typedItem = item as any;
      return {
        ...typedItem,
        fabric_name: typedItem.fabrics?.name || ''
      };
    });

    return inventoryWithFabricName;
  } catch (error) {
    console.error("Error in getInventoryByStatus:", error);
    throw error;
  }
};

/**
 * Thêm một mục mới vào kho
 */
export const createInventoryItem = async (
  item: Omit<FabricInventory, 'id' | 'created_at' | 'updated_at'>
): Promise<FabricInventory> => {
  try {
    // Kiểm tra xem mục này có fabric_id hợp lệ không
    const { data: fabricData, error: fabricError } = await supabaseBrowserClient
      .from(TABLES.FABRICS)
      .select('id')
      .eq('id', item.fabric_id)
      .single();

    if (fabricError) {
      console.error(`Fabric with id ${item.fabric_id} not found:`, fabricError);
      throw new Error(`Không tìm thấy loại vải với ID ${item.fabric_id}`);
    }

    const { data, error } = await supabaseBrowserClient
      .from(TABLES.FABRIC_INVENTORY)
      .insert([{
        ...item,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error("Error creating inventory item:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error in createInventoryItem:", error);
    throw error;
  }
};

/**
 * Cập nhật thông tin một mục trong kho
 */
export const updateInventoryItem = async (
  id: number, 
  item: Partial<FabricInventory>
): Promise<FabricInventory> => {
  try {
    const { data, error } = await supabaseBrowserClient
      .from(TABLES.FABRIC_INVENTORY)
      .update({
        ...item,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error("Error updating inventory item:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error in updateInventoryItem:", error);
    throw error;
  }
};

/**
 * Xóa một mục khỏi kho
 */
export const deleteInventoryItem = async (id: number): Promise<void> => {
  try {
    const { error } = await supabaseBrowserClient
      .from(TABLES.FABRIC_INVENTORY)
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Error deleting inventory item:", error);
      throw error;
    }
  } catch (error) {
    console.error("Error in deleteInventoryItem:", error);
    throw error;
  }
};

/**
 * Cập nhật trạng thái của nhiều mục trong kho
 */
export const updateInventoryItemsStatus = async (
  ids: number[], 
  status: string
): Promise<void> => {
  try {
    const { error } = await supabaseBrowserClient
      .from(TABLES.FABRIC_INVENTORY)
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .in('id', ids);

    if (error) {
      console.error("Error updating inventory items status:", error);
      throw error;
    }
  } catch (error) {
    console.error("Error in updateInventoryItemsStatus:", error);
    throw error;
  }
}; 