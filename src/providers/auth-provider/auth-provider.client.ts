"use client";

import type { AuthProvider } from "@refinedev/core";
import { supabaseBrowserClient } from "@utils/supabase/client";
import { UserRole } from "@utils/supabase/constants";
import { resources } from "../../app/resources";

// Mở rộng AuthProvider interface để bao gồm phương thức can
interface ExtendedAuthProvider extends AuthProvider {
  can: (params: { 
    resource?: string; 
    action?: string; 
    params?: any;
  }) => Promise<{ can: boolean }>;
}

// Hàm để lấy danh sách resources
const getResources = async () => {
  return resources;
};

export const authProviderClient: ExtendedAuthProvider = {
  login: async ({ email, password }) => {
    const { data, error } = await supabaseBrowserClient.auth.signInWithPassword(
      {
        email,
        password,
      }
    );

    if (error) {
      return {
        success: false,
        error,
      };
    }

    if (data?.session) {
      await supabaseBrowserClient.auth.setSession(data.session);

      return {
        success: true,
        redirectTo: "/",
      };
    }

    // for third-party login
    return {
      success: false,
      error: {
        name: "LoginError",
        message: "Invalid username or password",
      },
    };
  },
  logout: async () => {
    const { error } = await supabaseBrowserClient.auth.signOut();

    if (error) {
      return {
        success: false,
        error,
      };
    }

    return {
      success: true,
      redirectTo: "/login",
    };
  },
  register: async ({ email, password }) => {
    try {
      const { data, error } = await supabaseBrowserClient.auth.signUp({
        email,
        password,
      });

      if (error) {
        return {
          success: false,
          error,
        };
      }

      if (data) {
        // Thêm mới người dùng với vai trò mặc định
        const { error: roleError } = await supabaseBrowserClient
          .from("user_roles")
          .insert({
            user_id: data.user?.id,
            role: UserRole.PRODUCTION, // Vai trò mặc định khi đăng ký
          });

        if (roleError) {
          console.error("Không thể thiết lập vai trò mặc định:", roleError);
        }

        return {
          success: true,
          redirectTo: "/",
        };
      }
    } catch (error: any) {
      return {
        success: false,
        error,
      };
    }

    return {
      success: false,
      error: {
        message: "Register failed",
        name: "Invalid email or password",
      },
    };
  },
  check: async () => {
    const { data, error } = await supabaseBrowserClient.auth.getUser();
    const { user } = data;

    if (error) {
      return {
        authenticated: false,
        redirectTo: "/login",
        logout: true,
      };
    }

    if (user) {
      return {
        authenticated: true,
      };
    }

    return {
      authenticated: false,
      redirectTo: "/login",
    };
  },
  getPermissions: async () => {
    const { data: userData } = await supabaseBrowserClient.auth.getUser();
    
    if (userData?.user) {
      // Lấy vai trò của người dùng từ bảng user_roles
      const { data: roleData, error } = await supabaseBrowserClient
        .from("user_roles")
        .select("role")
        .eq("user_id", userData.user.id)
        .single();

      if (error) {
        console.error("Không thể lấy thông tin vai trò:", error);
        return null;
      }

      return roleData?.role;
    }

    return null;
  },
  getIdentity: async () => {
    try {
      const { data } = await supabaseBrowserClient.auth.getUser();

      if (data?.user) {
        // Lấy thêm thông tin vai trò
        const { data: roleData } = await supabaseBrowserClient
          .from("user_roles")
          .select("role")
          .eq("user_id", data.user.id)
          .single();
        
        // Lấy thêm thông tin profile người dùng (nếu có)
        const { data: profileData } = await supabaseBrowserClient
          .from("user_profiles")
          .select("*")
          .eq("user_id", data.user.id)
          .single();
          
        // Gộp thông tin để trả về user identity đầy đủ
        return {
          ...data.user,
          name: profileData?.full_name || data.user.email,
          role: roleData?.role,
          avatar: profileData?.avatar_url,
          department: profileData?.department,
          position: profileData?.position,
        };
      }

      return null;
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
      return null;
    }
  },
  onError: async (error) => {
    if (error?.code === "PGRST301" || error?.code === 401) {
      return {
        logout: true,
      };
    }

    return { error };
  },
  can: async ({ resource, action, params }) => {
    try {
      // Lấy thông tin người dùng và vai trò từ session
      const { data: userData } = await supabaseBrowserClient.auth.getUser();
      
      if (!userData?.user) {
        return { can: false };
      }
      
      // Lấy vai trò của người dùng
      const { data: roleData, error: roleError } = await supabaseBrowserClient
        .from("user_roles")
        .select("role")
        .eq("user_id", userData.user.id)
        .single();
        
      if (roleError) {
        console.error("Không thể lấy thông tin vai trò:", roleError);
        return { can: false };
      }
      
      const userRole = roleData?.role;
      
      // Kiểm tra quyền dựa trên vai trò
      // ADMIN có quyền làm mọi thứ
      if (userRole === UserRole.ADMIN) {
        return { can: true };
      }
      
      // Quyền xem là mặc định cho mọi người dùng đã đăng nhập
      if (action === "list" || action === "show") {
        return { can: true };
      }
      
      // Quyền chỉnh sửa và tạo mới dành cho MANAGER và các vai trò được chỉ định
      if (action === "edit" || action === "create") {
        // Kiểm tra quyền dựa trên resource và vai trò
        if (userRole === UserRole.MANAGER) {
          // Manager có thể chỉnh sửa hầu hết các tài nguyên, trừ user_roles
          if (resource !== "user_roles") {
            return { can: true };
          }
        }
        
        // WAREHOUSE có thể chỉnh sửa inventory và fabric-related
        if (userRole === UserRole.WAREHOUSE) {
          const warehouseResources = [
            "fabrics", 
            "fabric_inventory", 
            "fabric_issues",
            "inventory_checks"
          ];
          
          if (warehouseResources.includes(resource || "")) {
            return { can: true };
          }
        }
        
        // PRODUCTION có thể chỉnh sửa production-related
        if (userRole === UserRole.PRODUCTION) {
          const productionResources = [
            "cutting_orders", 
            "production-orders", 
            "production-stages", 
            "production-progress"
          ];
          
          if (productionResources.includes(resource || "")) {
            return { can: true };
          }
        }
        
        // HR có thể chỉnh sửa employee-related
        if (userRole === UserRole.HR) {
          const hrResources = ["employees", "employee-productivity"];
          
          if (hrResources.includes(resource || "")) {
            return { can: true };
          }
        }
        
        // QUALITY có thể chỉnh sửa quality-related
        if (userRole === UserRole.QUALITY) {
          const qualityResources = [
            "quality_control_records", 
            "quality_defects"
          ];
          
          if (qualityResources.includes(resource || "")) {
            return { can: true };
          }
        }
      }
      
      // Xóa chỉ dành cho ADMIN và MANAGER
      if (action === "delete") {
        // Kiểm tra nếu resource cho phép xóa (dựa vào meta.canDelete)
        const resourcesList = await getResources();
        const resourceMeta = resourcesList.find(r => r.name === resource)?.meta;
        
        if (userRole === UserRole.MANAGER && resourceMeta?.canDelete) {
          return { can: true };
        }
      }
      
      // Mặc định từ chối quyền
      return { can: false };
    } catch (error) {
      console.error("Lỗi khi kiểm tra quyền:", error);
      return { can: false };
    }
  },
};
