import { supabaseBrowserClient } from './client';

/**
 * Thời gian cache mặc định (5 phút)
 */
const DEFAULT_CACHE_TIME = 5 * 60 * 1000;

/**
 * Cache đơn giản lưu trong bộ nhớ
 */
const memoryCache: Map<string, { data: any; expiry: number }> = new Map();

/**
 * Xóa tất cả cache
 */
export const clearCache = (): void => {
  memoryCache.clear();
};

/**
 * Xóa cache theo key
 */
export const invalidateCache = (key: string): void => {
  memoryCache.delete(key);
};

/**
 * Xóa cache theo pattern
 */
export const invalidateCacheByPattern = (pattern: string): void => {
  const regex = new RegExp(pattern);
  for (const key of Array.from(memoryCache.keys())) {
    if (regex.test(key)) {
      memoryCache.delete(key);
    }
  }
};

/**
 * Lấy dữ liệu từ cache hoặc gọi API nếu chưa có trong cache
 */
export const fetchWithCache = async <T>(
  cacheKey: string,
  fetcher: () => Promise<T>,
  options: { expiryMs?: number; forceRefresh?: boolean } = {}
): Promise<T> => {
  const { expiryMs = DEFAULT_CACHE_TIME, forceRefresh = false } = options;
  const now = Date.now();

  // Kiểm tra xem có dữ liệu trong cache và còn hạn không
  if (!forceRefresh) {
    const cached = memoryCache.get(cacheKey);
    if (cached && cached.expiry > now) {
      console.log(`[Cache] Using cached data for: ${cacheKey}`);
      return cached.data;
    }
  }

  // Nếu không có trong cache hoặc đã hết hạn, fetch dữ liệu mới
  console.log(`[Cache] Fetching fresh data for: ${cacheKey}`);
  const data = await fetcher();

  // Lưu vào cache
  memoryCache.set(cacheKey, {
    data,
    expiry: now + expiryMs,
  });

  return data;
};

/**
 * Cấu trúc dữ liệu trả về cho paginated fetch
 */
export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  pageCount: number;
  page: number;
  pageSize: number;
}

/**
 * Lấy dữ liệu phân trang từ Supabase với caching
 */
export const fetchPaginatedData = async <T>(
  tableName: string,
  options: {
    page?: number;
    pageSize?: number;
    filters?: Record<string, any>;
    select?: string;
    orderBy?: { column: string; ascending?: boolean };
    cacheKey?: string;
    cacheDuration?: number;
    forceRefresh?: boolean;
  } = {}
): Promise<PaginatedResponse<T>> => {
  const {
    page = 1,
    pageSize = 10,
    filters = {},
    select = '*',
    orderBy,
    cacheKey,
    cacheDuration = DEFAULT_CACHE_TIME,
    forceRefresh = false,
  } = options;

  // Tạo cache key nếu không được cung cấp
  const effectiveCacheKey = cacheKey || 
    `${tableName}:page=${page}:size=${pageSize}:filters=${JSON.stringify(filters)}:order=${orderBy?.column || 'id'}-${orderBy?.ascending ? 'asc' : 'desc'}`;

  return fetchWithCache<PaginatedResponse<T>>(
    effectiveCacheKey,
    async () => {
      // Tính toán các giá trị cần thiết
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      // Tạo query ban đầu
      let query = supabaseBrowserClient
        .from(tableName)
        .select(select, { count: 'exact' });

      // Thêm các bộ lọc
      Object.entries(filters).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          query = query.in(key, value);
        } else if (typeof value === 'object' && value !== null) {
          // Xử lý các toán tử như gt, lt, gte, lte, etc.
          Object.entries(value).forEach(([op, val]) => {
            switch (op) {
              case 'gt':
                query = query.gt(key, val);
                break;
              case 'lt':
                query = query.lt(key, val);
                break;
              case 'gte':
                query = query.gte(key, val);
                break;
              case 'lte':
                query = query.lte(key, val);
                break;
              case 'like':
                query = query.like(key, val as string);
                break;
              case 'ilike':
                query = query.ilike(key, val as string);
                break;
              default:
                break;
            }
          });
        } else {
          query = query.eq(key, value);
        }
      });

      // Thêm sắp xếp nếu có
      if (orderBy) {
        query = query.order(orderBy.column, {
          ascending: orderBy.ascending ?? false,
        });
      } else {
        // Mặc định sắp xếp theo id giảm dần
        query = query.order('id', { ascending: false });
      }

      // Thêm phân trang
      query = query.range(from, to);

      // Thực hiện truy vấn
      const { data, error, count } = await query;

      if (error) {
        console.error(`Error fetching paginated data from ${tableName}:`, error);
        throw error;
      }

      // Tính tổng số trang
      const pageCount = count ? Math.ceil(count / pageSize) : 0;

      return {
        data: data as T[],
        count: count || 0,
        pageCount,
        page,
        pageSize,
      };
    },
    { expiryMs: cacheDuration, forceRefresh }
  );
};

/**
 * Hook để theo dõi các thay đổi và tự động invalidate cache
 */
export const subscribeToTableChanges = (
  tableName: string,
  onDataChange: () => void,
  options: { event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*' } = {}
): (() => void) => {
  const { event = '*' } = options;

  const subscription = supabaseBrowserClient
    .channel(`table-changes:${tableName}`)
    .on(
      'postgres_changes' as any,
      {
        event,
        schema: 'public',
        table: tableName,
      },
      (payload: { new: any; old: any; eventType: string }) => {
        console.log(`[Realtime] Table ${tableName} changed:`, payload);
        
        // Invalidate cache khi dữ liệu thay đổi
        invalidateCacheByPattern(`^${tableName}:`);
        
        // Gọi callback
        onDataChange();
      }
    )
    .subscribe();

  // Trả về hàm để unsubscribe
  return () => {
    supabaseBrowserClient.removeChannel(subscription);
  };
};

/**
 * Function để thực hiện tìm kiếm đơn giản trên bảng
 */
export const searchTable = async <T>(
  tableName: string,
  searchTerm: string,
  options: {
    columns: string[];
    limit?: number;
    select?: string;
    cacheKey?: string;
    cacheDuration?: number;
  }
): Promise<T[]> => {
  const {
    columns,
    limit = 20,
    select = '*',
    cacheKey,
    cacheDuration = DEFAULT_CACHE_TIME,
  } = options;

  const effectiveCacheKey = cacheKey || 
    `${tableName}:search=${searchTerm}:columns=${columns.join(',')}:limit=${limit}`;

  return fetchWithCache<T[]>(
    effectiveCacheKey,
    async () => {
      if (!searchTerm.trim()) {
        return [];
      }

      // Tạo các điều kiện tìm kiếm cho mỗi cột
      const conditions = columns.map(column => `${column}.ilike.%${searchTerm}%`);
      
      // Kết hợp các điều kiện với OR
      const searchQuery = conditions.join(',');

      const { data, error } = await supabaseBrowserClient
        .from(tableName)
        .select(select)
        .or(searchQuery)
        .limit(limit);

      if (error) {
        console.error(`Error searching in ${tableName}:`, error);
        throw error;
      }

      return data as T[];
    },
    { expiryMs: cacheDuration }
  );
}; 