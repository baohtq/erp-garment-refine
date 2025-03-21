import { supabaseBrowserClient } from '@/utils/supabase/client";
import { UserRole } from '@/utils/supabase/constants";
import { IRegisterData, IUpdateUserData, IUser } from "@/types/user";

const TABLE_NAME = "users";

export const userService = {
  /**
   * Đăng ký người dùng mới
   */
  registerUser: async (data: IRegisterData) => {
    try {
      // Đăng ký người dùng với Supabase Auth
      const { data: authData, error: authError } = await supabaseBrowserClient.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.full_name || '',
            role: data.role || UserRole.STAFF
          }
        }
      });

      if (authError) throw authError;

      if (!authData.user) {
        throw new Error("Không thể tạo người dùng");
      }

      // Thêm thông tin người dùng vào bảng users
      const { error: profileError } = await supabaseBrowserClient
        .from(TABLE_NAME)
        .insert({
          id: authData.user.id,
          email: data.email,
          full_name: data.full_name || '',
          role: data.role || UserRole.STAFF,
          is_active: true,
          created_at: new Date().toISOString()
        });

      if (profileError) throw profileError;

      return { success: true, user: authData.user };
    } catch (error) {
      console.error("Lỗi khi đăng ký người dùng:", error);
      return { success: false, error };
    }
  },

  /**
   * Lấy danh sách người dùng
   */
  getUsers: async () => {
    try {
      const { data, error } = await supabaseBrowserClient
        .from(TABLE_NAME)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error("Lỗi khi lấy danh sách người dùng:", error);
      return { success: false, error };
    }
  },

  /**
   * Lấy thông tin người dùng theo ID
   */
  getUserById: async (id: string) => {
    try {
      const { data, error } = await supabaseBrowserClient
        .from(TABLE_NAME)
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error(`Lỗi khi lấy thông tin người dùng ${id}:`, error);
      return { success: false, error };
    }
  },

  /**
   * Cập nhật thông tin người dùng
   */
  updateUser: async (id: string, updateData: IUpdateUserData) => {
    try {
      // Cập nhật thông tin trong bảng users
      const { data, error } = await supabaseBrowserClient
        .from(TABLE_NAME)
        .update({
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Không cố gắng cập nhật metadata Auth từ client vì client không có quyền admin

      return { success: true, data };
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin người dùng:", error);
      return { success: false, error };
    }
  },

  /**
   * Vô hiệu hóa người dùng
   */
  deactivateUser: async (id: string) => {
    try {
      const { data, error } = await supabaseBrowserClient
        .from(TABLE_NAME)
        .update({
          is_active: false,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error("Lỗi khi vô hiệu hóa người dùng:", error);
      return { success: false, error };
    }
  },

  /**
   * Kích hoạt lại người dùng
   */
  activateUser: async (id: string) => {
    try {
      const { data, error } = await supabaseBrowserClient
        .from(TABLE_NAME)
        .update({
          is_active: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error("Lỗi khi kích hoạt người dùng:", error);
      return { success: false, error };
    }
  },

  /**
   * Thay đổi vai trò người dùng
   */
  changeUserRole: async (id: string, role: UserRole) => {
    try {
      // Chỉ cập nhật vai trò trong bảng users
      const { data, error } = await supabaseBrowserClient
        .from(TABLE_NAME)
        .update({
          role,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Không cố gắng cập nhật metadata Auth từ client vì client không có quyền admin

      return { success: true, data };
    } catch (error) {
      console.error("Lỗi khi thay đổi vai trò người dùng:", error);
      return { success: false, error };
    }
  }
}; 