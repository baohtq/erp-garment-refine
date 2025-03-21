import { supabaseBrowserClient } from "@/utils/supabase/client";
import { TABLES } from "@/utils/supabase/constants";
import { FabricIssue, FabricIssueItem } from "@/mocks/fabric-management.mock";

/**
 * Lấy danh sách tất cả các phiếu xuất vải
 */
export const getAllFabricIssues = async (): Promise<FabricIssue[]> => {
  try {
    const { data, error } = await supabaseBrowserClient
      .from(TABLES.FABRIC_ISSUES)
      .select(`
        *,
        issued_by_employee:issued_by(full_name),
        received_by_employee:received_by(full_name)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching fabric issues:", error);
      throw error;
    }

    // Chuyển đổi dữ liệu để phù hợp với định dạng hiện tại
    const issues = data.map(issue => ({
      ...issue,
      issued_by_name: issue.issued_by_employee?.full_name,
      received_by_name: issue.received_by_employee?.full_name
    }));

    return issues;
  } catch (error) {
    console.error("Error in getAllFabricIssues:", error);
    throw error;
  }
};

/**
 * Lấy danh sách các phiếu xuất vải theo trạng thái
 */
export const getFabricIssuesByStatus = async (status: string): Promise<FabricIssue[]> => {
  try {
    const { data, error } = await supabaseBrowserClient
      .from(TABLES.FABRIC_ISSUES)
      .select(`
        *,
        issued_by_employee:issued_by(full_name),
        received_by_employee:received_by(full_name)
      `)
      .eq('status', status)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(`Error fetching fabric issues with status ${status}:`, error);
      throw error;
    }

    // Chuyển đổi dữ liệu để phù hợp với định dạng hiện tại
    const issues = data.map(issue => ({
      ...issue,
      issued_by_name: issue.issued_by_employee?.full_name,
      received_by_name: issue.received_by_employee?.full_name
    }));

    return issues;
  } catch (error) {
    console.error("Error in getFabricIssuesByStatus:", error);
    throw error;
  }
};

/**
 * Lấy phiếu xuất vải theo ID
 */
export const getFabricIssueById = async (id: number): Promise<FabricIssue> => {
  try {
    const { data, error } = await supabaseBrowserClient
      .from(TABLES.FABRIC_ISSUES)
      .select(`
        *,
        issued_by_employee:issued_by(full_name),
        received_by_employee:received_by(full_name)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching fabric issue with id ${id}:`, error);
      throw error;
    }

    // Chuyển đổi dữ liệu để phù hợp với định dạng hiện tại
    const issue = {
      ...data,
      issued_by_name: data.issued_by_employee?.full_name,
      received_by_name: data.received_by_employee?.full_name
    };

    return issue;
  } catch (error) {
    console.error("Error in getFabricIssueById:", error);
    throw error;
  }
};

/**
 * Tạo phiếu xuất vải mới
 */
export const createFabricIssue = async (
  issue: Omit<FabricIssue, 'id' | 'created_at' | 'updated_at'>,
  issueItems: Omit<FabricIssueItem, 'id' | 'created_at' | 'updated_at'>[]
): Promise<FabricIssue> => {
  // Sử dụng transaction để đảm bảo tất cả đều được lưu hoặc không có gì được lưu
  const { data, error } = await supabaseBrowserClient
    .rpc('create_fabric_issue', {
      issue_data: issue,
      issue_items_data: issueItems
    });

  if (error) {
    console.error("Error creating fabric issue:", error);
    throw error;
  }

  return data;
};

/**
 * Cập nhật phiếu xuất vải
 */
export const updateFabricIssue = async (id: number, issue: Partial<FabricIssue>): Promise<FabricIssue> => {
  try {
    const { data, error } = await supabaseBrowserClient
      .from(TABLES.FABRIC_ISSUES)
      .update({
        ...issue,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error("Error updating fabric issue:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error in updateFabricIssue:", error);
    throw error;
  }
};

/**
 * Xóa phiếu xuất vải
 */
export const deleteFabricIssue = async (id: number): Promise<void> => {
  try {
    // Xóa các mục liên quan trước
    const { error: itemsError } = await supabaseBrowserClient
      .from(TABLES.FABRIC_ISSUE_ITEMS)
      .delete()
      .eq('fabric_issue_id', id);

    if (itemsError) {
      console.error("Error deleting fabric issue items:", itemsError);
      throw itemsError;
    }

    // Xóa phiếu xuất vải
    const { error } = await supabaseBrowserClient
      .from(TABLES.FABRIC_ISSUES)
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Error deleting fabric issue:", error);
      throw error;
    }
  } catch (error) {
    console.error("Error in deleteFabricIssue:", error);
    throw error;
  }
};

/**
 * Lấy tất cả các mục trong phiếu xuất vải
 */
export const getFabricIssueItems = async (issueId: number): Promise<FabricIssueItem[]> => {
  try {
    const { data, error } = await supabaseBrowserClient
      .from(TABLES.FABRIC_ISSUE_ITEMS)
      .select(`
        *,
        inventory:inventory_id(id, roll_code, fabric_id, length, weight),
        fabrics:inventory(fabric_id(id, name, code))
      `)
      .eq('fabric_issue_id', issueId)
      .order('id');

    if (error) {
      console.error(`Error fetching fabric issue items for issue id ${issueId}:`, error);
      throw error;
    }

    // Chuyển đổi dữ liệu để phù hợp với định dạng hiện tại
    const items = data.map(item => ({
      ...item,
      roll_code: item.inventory?.roll_code,
      fabric_id: item.inventory?.fabric_id,
      fabric_name: item.fabrics?.name || 'Không xác định',
      fabric_code: item.fabrics?.code || 'N/A',
      length: item.inventory?.length || 0,
      weight: item.inventory?.weight || 0
    }));

    return items;
  } catch (error) {
    console.error("Error in getFabricIssueItems:", error);
    throw error;
  }
};

/**
 * Thêm mục vào phiếu xuất vải
 */
export const addFabricIssueItem = async (item: Omit<FabricIssueItem, 'id' | 'created_at' | 'updated_at'>): Promise<FabricIssueItem> => {
  try {
    const { data, error } = await supabaseBrowserClient
      .from(TABLES.FABRIC_ISSUE_ITEMS)
      .insert([{
        ...item,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error("Error adding fabric issue item:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error in addFabricIssueItem:", error);
    throw error;
  }
};

/**
 * Cập nhật mục trong phiếu xuất vải
 */
export const updateFabricIssueItem = async (id: number, item: Partial<FabricIssueItem>): Promise<FabricIssueItem> => {
  try {
    const { data, error } = await supabaseBrowserClient
      .from(TABLES.FABRIC_ISSUE_ITEMS)
      .update({
        ...item,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error("Error updating fabric issue item:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error in updateFabricIssueItem:", error);
    throw error;
  }
};

/**
 * Xóa mục khỏi phiếu xuất vải
 */
export const deleteFabricIssueItem = async (id: number): Promise<void> => {
  try {
    const { error } = await supabaseBrowserClient
      .from(TABLES.FABRIC_ISSUE_ITEMS)
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Error deleting fabric issue item:", error);
      throw error;
    }
  } catch (error) {
    console.error("Error in deleteFabricIssueItem:", error);
    throw error;
  }
}; 