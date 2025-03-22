import { supabaseBrowserClient } from "@/utils/supabase/client";
import { TABLES } from "@/utils/supabase/constants";
import { 
  Fabric, 
  FabricInventory, 
  Supplier, 
  DashboardStats,
  CuttingOrder
} from "@/types/fabric-management";

// Định nghĩa thời gian cache mặc định cho từng loại dữ liệu (tính bằng millisecond)
export const CACHE_TIMES = {
  FABRICS: 10 * 60 * 1000, // 10 phút
  INVENTORY: 5 * 60 * 1000, // 5 phút
  SUPPLIERS: 30 * 60 * 1000, // 30 phút
  DASHBOARD: 3 * 60 * 1000, // 3 phút
  CUTTING_ORDERS: 5 * 60 * 1000, // 5 phút
};

// Cache objects
interface CacheObject<T> {
  data: T | null;
  timestamp: number;
  expiresAt: number;
}

// Cache cho dashboard stats
let dashboardStatsCache: CacheObject<DashboardStats> = {
  data: null,
  timestamp: 0,
  expiresAt: 0
};

// Cache cho quality stats
let qualityStatsCache: CacheObject<any> = {
  data: null,
  timestamp: 0,
  expiresAt: 0
};

/**
 * Hàm hỗ trợ tìm kiếm trên bảng bất kỳ
 */
async function searchTable<T>(
  table: string,
  searchTerm: string,
  fields: string[],
  page: number = 1,
  pageSize: number = 10,
  orderBy: string = 'created_at',
  orderDirection: 'asc' | 'desc' = 'desc'
): Promise<{ data: T[], count: number }> {
  const query = supabaseBrowserClient
    .from(table)
    .select('*', { count: 'exact' });
  
  // Thêm điều kiện tìm kiếm
  if (searchTerm) {
    const searchConditions = fields.map(field => `${field}.ilike.%${searchTerm}%`);
    query.or(searchConditions.join(','));
  }
  
  // Thêm phân trang
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  
  // Thêm sắp xếp
  query.order(orderBy, { ascending: orderDirection === 'asc' });
  
  // Range cho phân trang
  query.range(from, to);
  
  try {
    const { data, error, count } = await query;
    
    if (error) {
      console.error('Error searching table:', error);
      throw error;
    }
    
    return { data: data as T[], count: count || 0 };
  } catch (error) {
    console.error(`Failed to search from ${table}:`, error);
    throw error;
  }
}

/**
 * Lấy danh sách vải phân trang, hỗ trợ tìm kiếm
 */
export async function getFabrics(
  page: number = 1, 
  pageSize: number = 10, 
  searchTerm: string = '',
  orderBy: string = 'created_at',
  orderDirection: 'asc' | 'desc' = 'desc'
): Promise<{ data: Fabric[], count: number }> {
  try {
    if (searchTerm) {
      // Nếu có search term, sử dụng hàm tìm kiếm
      return await searchTable<Fabric>(
        TABLES.FABRICS,
        searchTerm,
        ['name', 'code', 'material_type', 'color'],
        page,
        pageSize,
        orderBy,
        orderDirection
      );
    }
    
    // Nếu không có search term, sử dụng truy vấn thông thường với join
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    
    const { data, error, count } = await supabaseBrowserClient
      .from(TABLES.FABRICS)
      .select(`
        *,
        suppliers:supplier_id(name)
      `, { count: 'exact' })
      .order(orderBy, { ascending: orderDirection === 'asc' })
      .range(from, to);
    
    if (error) {
      console.error('Error fetching fabrics:', error);
      throw error;
    }
    
    // Format data to include supplier_name
    const formattedData = data.map(fabric => ({
      ...fabric,
      supplier_name: fabric.suppliers?.name
    }));
    
    return { data: formattedData, count: count || 0 };
  } catch (error) {
    console.error('Failed to fetch fabrics:', error);
    throw error;
  }
}

/**
 * Lấy danh sách tồn kho phân trang, hỗ trợ tìm kiếm
 */
export async function getInventory(
  page: number = 1, 
  pageSize: number = 10, 
  searchTerm: string = '',
  status: string | null = null,
  orderBy: string = 'created_at',
  orderDirection: 'asc' | 'desc' = 'desc'
): Promise<{ data: FabricInventory[], count: number }> {
  try {
    // Tạo query cơ bản
    const query = supabaseBrowserClient
      .from(TABLES.FABRIC_INVENTORY)
      .select(`
        *,
        fabric:fabric_id(id, name, code)
      `, { count: 'exact' });
    
    // Thêm điều kiện lọc theo status nếu có
    if (status) {
      query.eq('status', status);
    }
    
    // Thêm điều kiện tìm kiếm nếu có
    if (searchTerm) {
      query.or(`roll_code.ilike.%${searchTerm}%,batch_number.ilike.%${searchTerm}%,lot_number.ilike.%${searchTerm}%`);
    }
    
    // Thêm phân trang
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query.range(from, to);
    
    // Thêm sắp xếp
    query.order(orderBy, { ascending: orderDirection === 'asc' });
    
    const { data, error, count } = await query;
    
    if (error) {
      console.error('Error fetching inventory:', error);
      throw error;
    }
    
    // Format data to include fabric info
    const formattedData = data.map(item => ({
      ...item,
      fabric_name: item.fabric?.name,
      fabric_code: item.fabric?.code
    }));
    
    return { data: formattedData, count: count || 0 };
  } catch (error) {
    console.error('Failed to fetch inventory:', error);
    throw error;
  }
}

/**
 * Lấy danh sách nhà cung cấp phân trang, hỗ trợ tìm kiếm
 */
export async function getSuppliers(
  page: number = 1, 
  pageSize: number = 10, 
  searchTerm: string = '',
  orderBy: string = 'name',
  orderDirection: 'asc' | 'desc' = 'asc'
): Promise<{ data: Supplier[], count: number }> {
  try {
    if (searchTerm) {
      // Nếu có search term, sử dụng hàm tìm kiếm
      return await searchTable<Supplier>(
        TABLES.SUPPLIERS,
        searchTerm,
        ['name', 'contact_person', 'email', 'phone', 'address'],
        page,
        pageSize,
        orderBy,
        orderDirection
      );
    }
    
    // Không có search term
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    
    const { data, error, count } = await supabaseBrowserClient
      .from(TABLES.SUPPLIERS)
      .select('*', { count: 'exact' })
      .order(orderBy, { ascending: orderDirection === 'asc' })
      .range(from, to);
    
    if (error) {
      console.error('Error fetching suppliers:', error);
      throw error;
    }
    
    return { data, count: count || 0 };
  } catch (error) {
    console.error('Failed to fetch suppliers:', error);
    throw error;
  }
}

/**
 * Lấy thống kê tổng quan cho dashboard
 * Sử dụng cache để tối ưu hiệu suất
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  // Kiểm tra cache
  const now = Date.now();
  if (dashboardStatsCache.data && now < dashboardStatsCache.expiresAt) {
    console.log('Using cached dashboard stats');
    return dashboardStatsCache.data;
  }
  
  try {
    // Lấy tổng số vải
    const { count: totalFabrics, error: fabricError } = await supabaseBrowserClient
      .from(TABLES.FABRICS)
      .select('*', { count: 'exact', head: true });
    
    if (fabricError) {
      console.error('Error fetching total fabrics:', fabricError);
      throw fabricError;
    }
    
    // Lấy thống kê kho vải từ materialized view
    const { data: inventoryStats, error: statsError } = await supabaseBrowserClient
      .from('fabric_inventory_stats')
      .select('*')
      .single();
    
    if (statsError) {
      console.error('Error fetching inventory stats:', statsError);
      throw statsError;
    }
    
    // Lấy thống kê theo trạng thái
    const { data: statusCounts, error: statusError } = await supabaseBrowserClient
      .rpc('get_inventory_counts_by_status');
    
    if (statusError) {
      console.error('Error fetching status counts:', statusError);
      throw statusError;
    }
    
    // Lấy thống kê theo chất lượng
    const { data: qualityCounts, error: qualityError } = await supabaseBrowserClient
      .rpc('get_inventory_counts_by_quality_grade');
    
    if (qualityError) {
      console.error('Error fetching quality counts:', qualityError);
      throw qualityError;
    }
    
    // Lấy danh sách vải sắp hết
    const { data: lowStockFabrics, error: lowStockError } = await supabaseBrowserClient
      .rpc('get_low_stock_fabrics', { threshold: 5 });
    
    if (lowStockError) {
      console.error('Error fetching low stock fabrics:', lowStockError);
      throw lowStockError;
    }
    
    // Tạo đối tượng kết quả
    const result: DashboardStats = {
      totalFabrics: totalFabrics || 0,
      totalInventory: inventoryStats?.total_inventory || 0,
      availableInventory: inventoryStats?.available_count || 0,
      reservedInventory: inventoryStats?.reserved_count || 0,
      inUseInventory: inventoryStats?.in_use_count || 0, 
      usedInventory: inventoryStats?.used_count || 0,
      lowStockFabrics: lowStockFabrics || [],
      statusCounts: statusCounts || [],
      qualityCounts: qualityCounts || [],
      totalAvailableLength: inventoryStats?.total_available_length || 0,
      totalAvailableWeight: inventoryStats?.total_available_weight || 0
    };
    
    // Cập nhật cache
    dashboardStatsCache = {
      data: result,
      timestamp: now,
      expiresAt: now + CACHE_TIMES.DASHBOARD
    };
    
    return result;
  } catch (error) {
    console.error('Failed to fetch dashboard stats:', error);
    throw error;
  }
}

/**
 * Lấy thống kê chất lượng vải
 * Sử dụng cache để tối ưu hiệu suất
 */
export async function getQualityStats(): Promise<any> {
  // Kiểm tra cache
  const now = Date.now();
  if (qualityStatsCache.data && now < qualityStatsCache.expiresAt) {
    console.log('Using cached quality stats');
    return qualityStatsCache.data;
  }
  
  try {
    // Lấy số lượng theo cấp chất lượng
    const { data: qualityCounts, error: qualityError } = await supabaseBrowserClient
      .rpc('get_inventory_counts_by_quality_grade');
    
    if (qualityError) {
      console.error('Error fetching quality counts:', qualityError);
      throw qualityError;
    }
    
    // Lấy các lỗi gần đây
    const { data: recentDefects, error: defectsError } = await supabaseBrowserClient
      .from(TABLES.QUALITY_DEFECTS)
      .select(`
        *,
        quality_record:quality_record_id(
          id,
          inspection_date,
          original_grade,
          new_grade,
          inventory:inventory_id(
            id,
            roll_code,
            fabric_id,
            fabric:fabric_id(name, code)
          )
        )
      `)
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (defectsError) {
      console.error('Error fetching recent defects:', defectsError);
      throw defectsError;
    }
    
    // Định dạng lại dữ liệu
    const formattedDefects = recentDefects?.map(defect => ({
      ...defect,
      roll_code: defect.quality_record?.inventory?.roll_code,
      fabric_name: defect.quality_record?.inventory?.fabric?.name,
      fabric_code: defect.quality_record?.inventory?.fabric?.code,
      inspection_date: defect.quality_record?.inspection_date,
      original_grade: defect.quality_record?.original_grade,
      new_grade: defect.quality_record?.new_grade
    })) || [];
    
    // Tạo đối tượng kết quả
    const result = {
      qualityCounts: qualityCounts || [],
      recentDefects: formattedDefects
    };
    
    // Cập nhật cache
    qualityStatsCache = {
      data: result, 
      timestamp: now,
      expiresAt: now + CACHE_TIMES.DASHBOARD
    };
    
    return result;
  } catch (error) {
    console.error('Failed to fetch quality stats:', error);
    throw error;
  }
}

/**
 * Lấy danh sách lệnh cắt phân trang, hỗ trợ tìm kiếm
 */
export async function getCuttingOrders(
  page: number = 1, 
  pageSize: number = 10, 
  searchTerm: string = '',
  status: string | null = null,
  orderBy: string = 'planned_date',
  orderDirection: 'asc' | 'desc' = 'desc'
): Promise<{ data: CuttingOrder[], count: number }> {
  try {
    // Tạo query cơ bản
    const query = supabaseBrowserClient
      .from(TABLES.CUTTING_ORDERS)
      .select(`
        *,
        production_order:production_order_id(order_number),
        assigned_employee:assigned_to(name)
      `, { count: 'exact' });
    
    // Lọc theo status nếu có
    if (status) {
      query.eq('status', status);
    }
    
    // Tìm kiếm nếu có
    if (searchTerm) {
      query.or(`order_code.ilike.%${searchTerm}%,style_no.ilike.%${searchTerm}%`);
    }
    
    // Phân trang
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query.range(from, to);
    
    // Sắp xếp
    query.order(orderBy, { ascending: orderDirection === 'asc' });
    
    const { data, error, count } = await query;
    
    if (error) {
      console.error('Error fetching cutting orders:', error);
      throw error;
    }
    
    // Format data
    const formattedData = data.map(order => ({
      ...order,
      production_order_no: order.production_order?.order_number,
      assigned_to_name: order.assigned_employee?.name
    }));
    
    return { data: formattedData, count: count || 0 };
  } catch (error) {
    console.error('Failed to fetch cutting orders:', error);
    throw error;
  }
}

/**
 * Tạo hàm để xóa cache và cập nhật
 */
export function invalidateCache(cacheType: string): void {
  switch(cacheType) {
    case 'dashboard':
      dashboardStatsCache = { data: null, timestamp: 0, expiresAt: 0 };
      break;
    case 'quality':
      qualityStatsCache = { data: null, timestamp: 0, expiresAt: 0 };
      break;
    case 'all':
      dashboardStatsCache = { data: null, timestamp: 0, expiresAt: 0 };
      qualityStatsCache = { data: null, timestamp: 0, expiresAt: 0 };
      break;
    default:
      break;
  }
} 