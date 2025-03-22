import { supabaseBrowserClient } from "@/utils/supabase/client";
import { TABLES } from "@/utils/supabase/constants";

// Định nghĩa interface cho nhà cung cấp
export interface Supplier {
  id: number;
  name: string;
  code: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  address?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

/**
 * Lấy danh sách tất cả nhà cung cấp
 */
export const getAllSuppliers = async (): Promise<Supplier[]> => {
  try {
    const { data, error } = await supabaseBrowserClient
      .from(TABLES.SUPPLIERS)
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error("Error fetching suppliers:", error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Error in getAllSuppliers:", error);
    throw error;
  }
};

/**
 * Lấy danh sách nhà cung cấp theo trạng thái
 */
export const getSuppliersByStatus = async (status: string): Promise<Supplier[]> => {
  try {
    const { data, error } = await supabaseBrowserClient
      .from(TABLES.SUPPLIERS)
      .select('*')
      .eq('status', status)
      .order('name', { ascending: true });

    if (error) {
      console.error(`Error fetching suppliers with status ${status}:`, error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Error in getSuppliersByStatus:", error);
    throw error;
  }
};

/**
 * Lấy thông tin nhà cung cấp theo ID
 */
export const getSupplierById = async (id: number): Promise<Supplier> => {
  try {
    const { data, error } = await supabaseBrowserClient
      .from(TABLES.SUPPLIERS)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching supplier with id ${id}:`, error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error in getSupplierById:", error);
    throw error;
  }
};

/**
 * Tạo nhà cung cấp mới
 */
export const createSupplier = async (supplier: Omit<Supplier, 'id' | 'created_at' | 'updated_at'>): Promise<Supplier> => {
  try {
    const { data, error } = await supabaseBrowserClient
      .from(TABLES.SUPPLIERS)
      .insert([{
        ...supplier,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error("Error creating supplier:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error in createSupplier:", error);
    throw error;
  }
};

/**
 * Cập nhật thông tin nhà cung cấp
 */
export const updateSupplier = async (id: number, supplier: Partial<Supplier>): Promise<Supplier> => {
  try {
    const { data, error } = await supabaseBrowserClient
      .from(TABLES.SUPPLIERS)
      .update({
        ...supplier,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error("Error updating supplier:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error in updateSupplier:", error);
    throw error;
  }
};

/**
 * Xóa nhà cung cấp
 */
export const deleteSupplier = async (id: number): Promise<void> => {
  try {
    // Kiểm tra xem nhà cung cấp có đang được sử dụng trong bất kỳ bảng nào khác không
    const { count, error: countError } = await supabaseBrowserClient
      .from(TABLES.FABRICS)
      .select('*', { count: 'exact', head: true })
      .eq('supplier_id', id);

    if (countError) {
      console.error("Error checking supplier references:", countError);
      throw countError;
    }

    if (count && count > 0) {
      throw new Error(`Không thể xóa nhà cung cấp vì đang được sử dụng trong ${count} loại vải.`);
    }

    // Xóa nhà cung cấp
    const { error } = await supabaseBrowserClient
      .from(TABLES.SUPPLIERS)
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Error deleting supplier:", error);
      throw error;
    }
  } catch (error) {
    console.error("Error in deleteSupplier:", error);
    throw error;
  }
};

/**
 * Tìm kiếm nhà cung cấp
 */
export const searchSuppliers = async (searchTerm: string): Promise<Supplier[]> => {
  try {
    // Tìm kiếm theo tên hoặc mã nhà cung cấp
    const { data, error } = await supabaseBrowserClient
      .from(TABLES.SUPPLIERS)
      .select('*')
      .or(`name.ilike.%${searchTerm}%,code.ilike.%${searchTerm}%`)
      .order('name', { ascending: true });

    if (error) {
      console.error("Error searching suppliers:", error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Error in searchSuppliers:", error);
    throw error;
  }
}; 