"use client";

import type { AuthProvider } from "@refinedev/core";
import { supabaseBrowserClient } from "@utils/supabase/client";
import { UserRole, Permission, ROLE_PERMISSIONS } from "@utils/supabase/constants";
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

// Kiểm tra vai trò người dùng hiện tại
const getCurrentUserRole = async (): Promise<UserRole> => {
  try {
    const { data: { user } } = await supabaseBrowserClient.auth.getUser();
    
    if (!user) return UserRole.GUEST;
    
    // Lấy thông tin về vai trò từ metadata của user
    const userRole = user.user_metadata?.role as UserRole;
    
    // Nếu không có role trong metadata, kiểm tra trong database
    if (!userRole) {
      const { data, error } = await supabaseBrowserClient
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();
      
      if (error || !data) return UserRole.GUEST;
      
      return data.role as UserRole || UserRole.GUEST;
    }
    
    return userRole;
  } catch (error) {
    console.error("Error getting user role:", error);
    return UserRole.GUEST;
  }
};

// Danh sách các resource đặc biệt và quyền cần thiết
const RESOURCE_PERMISSIONS: Record<string, Record<string, Permission[]>> = {
  'users': {
    'list': [Permission.MANAGE_USERS],
    'create': [Permission.MANAGE_USERS],
    'edit': [Permission.MANAGE_USERS],
    'show': [Permission.MANAGE_USERS],
    'delete': [Permission.MANAGE_USERS],
  },
  'settings': {
    'list': [Permission.CONFIGURE_SYSTEM],
    'create': [Permission.CONFIGURE_SYSTEM],
    'edit': [Permission.CONFIGURE_SYSTEM],
    'show': [Permission.CONFIGURE_SYSTEM],
    'delete': [Permission.CONFIGURE_SYSTEM],
  }
};

// Map action từ Refine sang Permission
const mapActionToPermission = (action: string): Permission => {
  switch (action) {
    case 'list':
    case 'show':
      return Permission.VIEW;
    case 'create':
      return Permission.CREATE;
    case 'edit':
    case 'update':
      return Permission.EDIT;
    case 'delete':
      return Permission.DELETE;
    case 'export':
      return Permission.EXPORT;
    case 'approve':
      return Permission.APPROVE;
    case 'reject':
      return Permission.REJECT;
    default:
      return Permission.VIEW;
  }
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
      // Nếu không có resource hoặc action, cho phép mặc định
      if (!resource || !action) {
        return { can: true };
      }

      const userRole = await getCurrentUserRole();
      
      // Nếu là admin, cho phép mọi action
      if (userRole === UserRole.ADMIN) {
        return { can: true };
      }
      
      // Lấy danh sách quyền của role hiện tại
      const userPermissions = ROLE_PERMISSIONS[userRole] || [];
      
      // Kiểm tra các resource đặc biệt
      if (RESOURCE_PERMISSIONS[resource]?.[action]) {
        const requiredPermissions = RESOURCE_PERMISSIONS[resource][action];
        const hasAllPermissions = requiredPermissions.every(
          (permission) => userPermissions.includes(permission)
        );
        return { can: hasAllPermissions };
      }
      
      // Với các resource thông thường, kiểm tra quyền tương ứng với action
      const requiredPermission = mapActionToPermission(action);
      return { can: userPermissions.includes(requiredPermission) };
    } catch (error) {
      console.error("Error checking permissions:", error);
      return { can: false };
    }
  },
};
