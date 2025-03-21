import { supabaseBrowserClient } from "@/utils/supabase/client";
import { TABLES } from "@/utils/supabase/constants";
import { Fabric } from "@/mocks/fabric-management.mock";

/**
 * Lấy danh sách tất cả các loại vải
 */
export const getAllFabrics = async (): Promise<Fabric[]> => {
  try {
    const { data, error } = await supabaseBrowserClient
      .from(TABLES.FABRICS)
      .select(`
        *,
        suppliers:${TABLES.SUPPLIERS}(name)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching fabrics:", error);
      throw error;
    }

    // Chuyển đổi dữ liệu để phù hợp với định dạng hiện tại
    const fabricsWithSupplierName = data.map(fabric => {
      const typedFabric = fabric as any;
      return {
        ...typedFabric,
        supplier_name: typedFabric.suppliers?.name || ''
      };
    });

    return fabricsWithSupplierName;
  } catch (error) {
    console.error("Error in getAllFabrics:", error);
    throw error;
  }
};

/**
 * Thêm mới một loại vải
 */
export const createFabric = async (fabric: Omit<Fabric, 'id' | 'created_at' | 'updated_at'>): Promise<Fabric> => {
  try {
    const { data, error } = await supabaseBrowserClient
      .from(TABLES.FABRICS)
      .insert([{
        ...fabric,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error("Error creating fabric:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error in createFabric:", error);
    throw error;
  }
};

/**
 * Cập nhật thông tin loại vải
 */
export const updateFabric = async (id: number, fabric: Partial<Fabric>): Promise<Fabric> => {
  try {
    const { data, error } = await supabaseBrowserClient
      .from(TABLES.FABRICS)
      .update({
        ...fabric,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error("Error updating fabric:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error in updateFabric:", error);
    throw error;
  }
};

/**
 * Xóa một loại vải
 */
export const deleteFabric = async (id: number): Promise<void> => {
  try {
    const { error } = await supabaseBrowserClient
      .from(TABLES.FABRICS)
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Error deleting fabric:", error);
      throw error;
    }
  } catch (error) {
    console.error("Error in deleteFabric:", error);
    throw error;
  }
};

/**
 * Lấy thông tin một loại vải
 */
export const getFabricById = async (id: number): Promise<Fabric> => {
  try {
    const { data, error } = await supabaseBrowserClient
      .from(TABLES.FABRICS)
      .select(`
        *,
        suppliers:${TABLES.SUPPLIERS}(name)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching fabric with id ${id}:`, error);
      throw error;
    }

    // Chuyển đổi dữ liệu để phù hợp với định dạng hiện tại
    const fabricWithSupplierName = {
      ...(data as any),
      supplier_name: (data as any).suppliers?.name || ''
    };

    return fabricWithSupplierName;
  } catch (error) {
    console.error("Error in getFabricById:", error);
    throw error;
  }
}; 