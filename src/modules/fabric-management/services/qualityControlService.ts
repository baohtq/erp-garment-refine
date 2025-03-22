import { supabaseBrowserClient } from "@/utils/supabase/client";
import { TABLES } from "@/utils/supabase/constants";
import { FabricQualityGrade } from "@/utils/supabase/constants";

// Định nghĩa interface cho báo cáo chất lượng
export interface QualityControlRecord {
  id?: number;
  inventory_id: number;
  roll_code?: string;
  fabric_id?: number;
  fabric_name?: string;
  inspection_date: string;
  inspected_by: number;
  inspected_by_name?: string;
  original_grade: string;
  new_grade: string;
  defects: QualityDefect[];
  comments?: string;
  created_at?: string;
  updated_at?: string;
}

// Định nghĩa interface cho lỗi chất lượng
export interface QualityDefect {
  id?: number;
  quality_record_id?: number;
  defect_type: string;
  defect_position: string;
  severity: 'minor' | 'major' | 'critical';
  length?: number;
  width?: number;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Lấy danh sách tất cả các báo cáo kiểm soát chất lượng
 */
export const getAllQualityRecords = async (): Promise<QualityControlRecord[]> => {
  try {
    const { data, error } = await supabaseBrowserClient
      .from('quality_control_records')
      .select(`
        *,
        inventory:inventory_id(id, roll_code, fabric_id),
        fabrics:inventory(fabric_id(id, name, code)),
        inspected_by_employee:inspected_by(id, full_name),
        defects:quality_defects(*)
      `)
      .order('inspection_date', { ascending: false });

    if (error) {
      console.error("Error fetching quality records:", error);
      throw error;
    }

    // Chuyển đổi dữ liệu để phù hợp với định dạng hiện tại
    const records = data.map(record => ({
      ...record,
      roll_code: record.inventory?.roll_code,
      fabric_id: record.inventory?.fabric_id,
      fabric_name: record.fabrics?.name,
      inspected_by_name: record.inspected_by_employee?.full_name
    }));

    return records;
  } catch (error) {
    console.error("Error in getAllQualityRecords:", error);
    throw error;
  }
};

/**
 * Lấy báo cáo kiểm soát chất lượng theo ID
 */
export const getQualityRecordById = async (id: number): Promise<QualityControlRecord> => {
  try {
    const { data, error } = await supabaseBrowserClient
      .from('quality_control_records')
      .select(`
        *,
        inventory:inventory_id(id, roll_code, fabric_id),
        fabrics:inventory(fabric_id(id, name, code)),
        inspected_by_employee:inspected_by(id, full_name),
        defects:quality_defects(*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching quality record with id ${id}:`, error);
      throw error;
    }

    // Chuyển đổi dữ liệu để phù hợp với định dạng hiện tại
    const record = {
      ...data,
      roll_code: data.inventory?.roll_code,
      fabric_id: data.inventory?.fabric_id,
      fabric_name: data.fabrics?.name,
      inspected_by_name: data.inspected_by_employee?.full_name
    };

    return record;
  } catch (error) {
    console.error("Error in getQualityRecordById:", error);
    throw error;
  }
};

/**
 * Lấy báo cáo kiểm soát chất lượng theo cuộn vải
 */
export const getQualityRecordsByInventoryId = async (inventoryId: number): Promise<QualityControlRecord[]> => {
  try {
    const { data, error } = await supabaseBrowserClient
      .from('quality_control_records')
      .select(`
        *,
        inventory:inventory_id(id, roll_code, fabric_id),
        fabrics:inventory(fabric_id(id, name, code)),
        inspected_by_employee:inspected_by(id, full_name),
        defects:quality_defects(*)
      `)
      .eq('inventory_id', inventoryId)
      .order('inspection_date', { ascending: false });

    if (error) {
      console.error(`Error fetching quality records for inventory id ${inventoryId}:`, error);
      throw error;
    }

    // Chuyển đổi dữ liệu để phù hợp với định dạng hiện tại
    const records = data.map(record => ({
      ...record,
      roll_code: record.inventory?.roll_code,
      fabric_id: record.inventory?.fabric_id,
      fabric_name: record.fabrics?.name,
      inspected_by_name: record.inspected_by_employee?.full_name
    }));

    return records;
  } catch (error) {
    console.error("Error in getQualityRecordsByInventoryId:", error);
    throw error;
  }
};

/**
 * Tạo báo cáo kiểm soát chất lượng mới
 */
export const createQualityRecord = async (
  record: Omit<QualityControlRecord, 'id' | 'created_at' | 'updated_at'>
): Promise<QualityControlRecord> => {
  try {
    // Sử dụng transaction để đảm bảo tất cả đều được lưu hoặc không có gì được lưu
    const { data, error } = await supabaseBrowserClient
      .rpc('create_quality_record', {
        record_data: {
          inventory_id: record.inventory_id,
          inspection_date: record.inspection_date,
          inspected_by: record.inspected_by,
          original_grade: record.original_grade,
          new_grade: record.new_grade,
          comments: record.comments || '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        defects_data: record.defects || []
      });

    if (error) {
      console.error("Error creating quality record:", error);
      throw error;
    }

    // Cập nhật cấp chất lượng của cuộn vải
    await supabaseBrowserClient
      .from(TABLES.FABRIC_INVENTORY)
      .update({
        quality_grade: record.new_grade,
        defect_notes: record.comments || '',
        updated_at: new Date().toISOString()
      })
      .eq('id', record.inventory_id);

    return data;
  } catch (error) {
    console.error("Error in createQualityRecord:", error);
    throw error;
  }
};

/**
 * Cập nhật báo cáo kiểm soát chất lượng
 */
export const updateQualityRecord = async (
  id: number, 
  record: Partial<QualityControlRecord>
): Promise<QualityControlRecord> => {
  try {
    const { data, error } = await supabaseBrowserClient
      .from('quality_control_records')
      .update({
        ...record,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error("Error updating quality record:", error);
      throw error;
    }

    // Cập nhật cấp chất lượng của cuộn vải nếu thay đổi
    if (record.new_grade) {
      await supabaseBrowserClient
        .from(TABLES.FABRIC_INVENTORY)
        .update({
          quality_grade: record.new_grade,
          defect_notes: record.comments || '',
          updated_at: new Date().toISOString()
        })
        .eq('id', data.inventory_id);
    }

    return data;
  } catch (error) {
    console.error("Error in updateQualityRecord:", error);
    throw error;
  }
};

/**
 * Xóa báo cáo kiểm soát chất lượng
 */
export const deleteQualityRecord = async (id: number): Promise<void> => {
  try {
    // Xóa các mục lỗi liên quan trước
    const { error: defectsError } = await supabaseBrowserClient
      .from('quality_defects')
      .delete()
      .eq('quality_record_id', id);

    if (defectsError) {
      console.error("Error deleting quality defects:", defectsError);
      throw defectsError;
    }

    // Xóa báo cáo kiểm soát chất lượng
    const { error } = await supabaseBrowserClient
      .from('quality_control_records')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Error deleting quality record:", error);
      throw error;
    }
  } catch (error) {
    console.error("Error in deleteQualityRecord:", error);
    throw error;
  }
};

/**
 * Thêm lỗi vào báo cáo chất lượng
 */
export const addQualityDefect = async (
  recordId: number, 
  defect: Omit<QualityDefect, 'id' | 'quality_record_id' | 'created_at' | 'updated_at'>
): Promise<QualityDefect> => {
  try {
    const { data, error } = await supabaseBrowserClient
      .from('quality_defects')
      .insert([{
        quality_record_id: recordId,
        ...defect,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error("Error adding quality defect:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error in addQualityDefect:", error);
    throw error;
  }
};

/**
 * Lấy tất cả lỗi của một báo cáo chất lượng
 */
export const getQualityDefects = async (recordId: number): Promise<QualityDefect[]> => {
  try {
    const { data, error } = await supabaseBrowserClient
      .from('quality_defects')
      .select('*')
      .eq('quality_record_id', recordId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(`Error fetching quality defects for record id ${recordId}:`, error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Error in getQualityDefects:", error);
    throw error;
  }
};

/**
 * Cập nhật một lỗi chất lượng
 */
export const updateQualityDefect = async (id: number, defect: Partial<QualityDefect>): Promise<QualityDefect> => {
  try {
    const { data, error } = await supabaseBrowserClient
      .from('quality_defects')
      .update({
        ...defect,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error("Error updating quality defect:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error in updateQualityDefect:", error);
    throw error;
  }
};

/**
 * Xóa một lỗi chất lượng
 */
export const deleteQualityDefect = async (id: number): Promise<void> => {
  try {
    const { error } = await supabaseBrowserClient
      .from('quality_defects')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Error deleting quality defect:", error);
      throw error;
    }
  } catch (error) {
    console.error("Error in deleteQualityDefect:", error);
    throw error;
  }
}; 