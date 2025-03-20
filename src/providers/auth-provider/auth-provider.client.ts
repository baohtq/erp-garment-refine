"use client";

import type { AuthProvider } from "@refinedev/core";
import { supabaseBrowserClient } from "@utils/supabase/client";
import { UserRole } from "@utils/supabase/constants";

export const authProviderClient: AuthProvider = {
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
    const { data } = await supabaseBrowserClient.auth.getUser();

    if (data?.user) {
      // Lấy thêm thông tin vai trò
      const { data: roleData } = await supabaseBrowserClient
        .from("user_roles")
        .select("role")
        .eq("user_id", data.user.id)
        .single();

      return {
        ...data.user,
        name: data.user.email,
        role: roleData?.role,
      };
    }

    return null;
  },
  onError: async (error) => {
    if (error?.code === "PGRST301" || error?.code === 401) {
      return {
        logout: true,
      };
    }

    return { error };
  },
};
