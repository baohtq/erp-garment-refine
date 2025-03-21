import { createClient } from "@supabase/supabase-js";
// Remove this import and use environment variables directly
// import { SUPABASE_KEY, SUPABASE_URL } from "./constants";

// Use hardcoded values directly
const SUPABASE_URL = "https://vpbqbujxsvnleuvzfhui.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZwYnFidWp4c3ZubGV1dnpmaHVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0MDMxMjcsImV4cCI6MjA1Nzk3OTEyN30.XZ1MvQnwxQ0YU8lZErmujnJ2iKjqCJXsdVQPAXY2Qcc";

// Force using mockData globally for demo purposes
const USE_MOCK_DATA = true;

// Log kết nối cho debugging
console.log("Connecting to Supabase:", SUPABASE_URL);
console.log("USING MOCK DATA:", USE_MOCK_DATA ? "YES" : "NO");

/**
 * Supabase client cho server components
 * Chỉ sử dụng trong server components
 */
export const createServerSupabaseClient = () => {
  return createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: {
      persistSession: false,
    },
    db: {
      schema: 'public',
    },
    global: {
      headers: {
        'x-application-name': 'erp-garment',
      },
    },
  });
};

/**
 * Supabase client cho browser components
 * Chỉ sử dụng trong client components
 */
export const supabaseBrowserClient = createClient(
  SUPABASE_URL,
  SUPABASE_KEY,
  {
    auth: {
      persistSession: true,
      storageKey: 'erp-garment-auth',
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    },
    db: {
      schema: 'public',
    },
    global: {
      headers: {
        'x-application-name': 'erp-garment',
      },
    },
  }
);

/**
 * Hàm này trả về Supabase client dành cho server-side
 * và sử dụng cookies từ request để duy trì session
 * (sử dụng trong Route Handlers, Server Actions)
 */
export const createServerActionClient = async (cookies: any) => {
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: {
      persistSession: true,
      storageKey: 'erp-garment-auth',
      storage: {
        getItem: (key) => {
          return cookies.get(key)?.value;
        },
        setItem: (key, value) => {
          cookies.set(key, value, {
            maxAge: 60 * 60 * 8, // 8 giờ
            path: '/',
          });
        },
        removeItem: (key) => {
          cookies.delete(key);
        },
      },
    },
    db: {
      schema: 'public',
    },
    global: {
      headers: {
        'x-application-name': 'erp-garment',
      },
    },
  });

  return supabase;
};

/**
 * Hàm kiểm tra xem API Supabase có hoạt động không
 */
export const checkSupabaseConnection = async (): Promise<boolean> => {
  if (USE_MOCK_DATA) {
    console.log("Using mock data - skipping real connection check");
    return true;
  }
  
  try {
    const { data, error } = await supabaseBrowserClient.from('health_check').select('*').limit(1);

    if (error) {
      console.error('Lỗi kết nối Supabase:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Lỗi kết nối Supabase:', error);
    return false;
  }
};

// Check nếu chúng ta nên sử dụng mock data
export const shouldUseMockData = () => {
  return USE_MOCK_DATA;
};
