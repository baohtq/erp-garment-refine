"use client";

import { DataProvider } from "@refinedev/core";
import { dataProvider as dataProviderSupabase } from "@refinedev/supabase";
import { supabaseBrowserClient } from "@/utils/supabase/client";
import { TABLES } from "@/utils/supabase/constants";

// Định nghĩa interface mở rộng cho DataProvider
interface CustomDataProvider extends DataProvider {
  getInventoryStatistics: (params?: any) => Promise<any>;
  getFabricIssueDetails: (params: { id: string | number }) => Promise<any>;
  bulkUpdateInventoryStatus: (params: { ids: (string | number)[]; data: { status: string } }) => Promise<any>;
}

// Tạo data provider cơ bản từ thư viện Refine
const baseDataProvider = dataProviderSupabase(supabaseBrowserClient);

// Mở rộng data provider với các phương thức tùy chỉnh
export const dataProvider: CustomDataProvider = {
  ...baseDataProvider,
  
  // Thêm các phương thức tùy chỉnh
  
  // Lấy thống kê kho vải
  getInventoryStatistics: async () => {
    try {
      // Thống kê số lượng vải theo trạng thái
      const { data: statusStats, error: statusError } = await supabaseBrowserClient
        .from(TABLES.FABRIC_INVENTORY)
        .select('status, count')
        .select(`
          status,
          count(*) OVER (PARTITION BY status)
        `);
      
      if (statusError) throw statusError;
      
      // Thống kê theo chất lượng
      const { data: qualityStats, error: qualityError } = await supabaseBrowserClient
        .from(TABLES.FABRIC_INVENTORY)
        .select(`
          quality_grade,
          count(*) OVER (PARTITION BY quality_grade)
        `);
        
      if (qualityError) throw qualityError;
      
      // Tổng số lượng và trọng lượng khả dụng
      const { data: availableStats, error: availableError } = await supabaseBrowserClient
        .from(TABLES.FABRIC_INVENTORY)
        .select('SUM(length) as total_length, SUM(weight) as total_weight')
        .eq('status', 'available');
        
      if (availableError) throw availableError;
      
      // Danh sách vải tồn kho thấp
      const { data: lowStockFabrics, error: lowStockError } = await supabaseBrowserClient
        .from(TABLES.FABRICS)
        .select(`
          *,
          inventory:${TABLES.FABRIC_INVENTORY}(id, status)
        `)
        .eq('inventory.status', 'available');
        
      if (lowStockError) throw lowStockError;
      
      // Xử lý để tìm vải có tồn kho thấp
      const fabricsWithLowStock = lowStockFabrics
        .map((fabric: any) => {
          const availableCount = fabric.inventory?.filter((i: any) => i.status === 'available')?.length || 0;
          return {
            ...fabric,
            available_count: availableCount
          };
        })
        .filter((fabric: any) => fabric.available_count < (fabric.min_stock_level || 5));
        
      return {
        data: {
          statusStats,
          qualityStats,
          availableStats: availableStats?.[0] || { total_length: 0, total_weight: 0 },
          lowStockFabrics: fabricsWithLowStock
        }
      };
    } catch (error: any) {
      return {
        error: {
          message: error.message || "Không thể lấy thống kê kho",
          statusCode: error.statusCode || 500
        }
      };
    }
  },
  
  // Lấy dữ liệu phát vải chi tiết
  getFabricIssueDetails: async ({ id }) => {
    try {
      const { data: issueData, error: issueError } = await supabaseBrowserClient
        .from(TABLES.FABRIC_ISSUES)
        .select(`
          *,
          items:${TABLES.FABRIC_ISSUE_ITEMS}(
            *,
            inventory:${TABLES.FABRIC_INVENTORY}(
              *,
              fabric:${TABLES.FABRICS}(id, name, code)
            )
          )
        `)
        .eq('id', id)
        .single();
        
      if (issueError) throw issueError;
      
      return {
        data: issueData
      };
    } catch (error: any) {
      return {
        error: {
          message: error.message || "Không thể lấy chi tiết phát vải",
          statusCode: error.statusCode || 500
        }
      };
    }
  },
  
  // Chuyển trạng thái hàng loạt cho nhiều inventory item
  bulkUpdateInventoryStatus: async ({ ids, data }) => {
    try {
      const { data: result, error } = await supabaseBrowserClient
        .from(TABLES.FABRIC_INVENTORY)
        .update({ 
          status: data.status,
          updated_at: new Date().toISOString()
        })
        .in('id', ids);
        
      if (error) throw error;
      
      return {
        data: {
          success: true,
          affectedIds: ids
        }
      };
    } catch (error: any) {
      return {
        error: {
          message: error.message || "Không thể cập nhật trạng thái kho hàng loạt",
          statusCode: error.statusCode || 500
        }
      };
    }
  }
};
