import { UserRole } from "@utils/supabase/constants";

// Interface mô tả dữ liệu người dùng
export interface IUser {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  role: UserRole;
  created_at: string;
  last_sign_in_at?: string;
  is_active: boolean;
  department?: string;
  position?: string;
  phone_number?: string;
}

// Interface cho dữ liệu đăng ký
export interface IRegisterData {
  email: string;
  password: string;
  full_name?: string;
  role?: UserRole;
}

// Interface cho dữ liệu đăng nhập
export interface ILoginData {
  email: string;
  password: string;
}

// Interface cho dữ liệu đổi mật khẩu
export interface IChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

// Interface cập nhật thông tin người dùng
export interface IUpdateUserData {
  full_name?: string;
  avatar_url?: string;
  role?: UserRole;
  department?: string;
  position?: string;
  phone_number?: string;
  is_active?: boolean;
} 