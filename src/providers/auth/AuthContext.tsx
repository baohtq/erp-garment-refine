'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import toast from 'react-hot-toast';
import { AUTH_ROUTES, ROUTES } from '@/config/constants';

// Định nghĩa kiểu dữ liệu người dùng
export interface UserData {
  id: string;
  email: string;
  fullName: string;
  role: string;
  company?: string;
  avatar?: string;
}

// Định nghĩa context
interface AuthContextType {
  user: UserData | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  signUp: (email: string, password: string, userData: Omit<UserData, 'id'>) => Promise<void>;
  signOut: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (password: string, token: string) => Promise<void>;
}

// Tạo context với giá trị mặc định
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook để sử dụng context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // Người dùng mặc định để bypass xác thực
  const defaultUser: UserData = {
    id: 'demo-user-id',
    email: 'demo@example.com',
    fullName: 'Demo User',
    role: 'admin',
    company: 'Demo Company',
    avatar: '',
  };
  
  const [user, setUser] = useState<UserData | null>(defaultUser); // Luôn coi người dùng đã đăng nhập với tài khoản demo
  const [isLoading, setIsLoading] = useState<boolean>(false); // Không cần tải
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClientComponentClient();

  // Kiểm tra xem người dùng đã đăng nhập chưa
  useEffect(() => {
    // Bypass kiểm tra phiên, luôn trả về người dùng mặc định
    setIsLoading(false);
    
    // KHÔNG chuyển hướng nếu người dùng đã ở một trang không phải trang login
    if (pathname !== ROUTES.LOGIN && pathname !== ROUTES.REGISTER && pathname !== ROUTES.FORGOT_PASSWORD) {
      return; // Người dùng đã ở một trang hợp lệ, không cần chuyển hướng
    }
    
    // Chuyển hướng về trang chủ nếu người dùng đang ở trang đăng nhập
    if (pathname === ROUTES.LOGIN || pathname === ROUTES.REGISTER || pathname === ROUTES.FORGOT_PASSWORD) {
      router.push(ROUTES.DASHBOARD);
    }
    
    // Auth state change không cần thiết nhưng giữ lại để tránh lỗi
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      // Không làm gì
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, router, pathname]);

  // Đăng nhập - luôn thành công và chuyển hướng về trang chủ
  const signIn = async (email: string, password: string, rememberMe = false) => {
    try {
      // Không cần gọi API auth, chỉ cần chuyển hướng
      router.push(ROUTES.DASHBOARD);
    } catch (error) {
      console.error('Error in mock sign in:', error);
    }
  };

  // Đăng ký - luôn thành công
  const signUp = async (
    email: string, 
    password: string, 
    userData: Omit<UserData, 'id'>
  ) => {
    toast.success('Đăng ký thành công!');
    router.push(ROUTES.DASHBOARD);
  };

  // Đăng xuất - không thực sự đăng xuất
  const signOut = async () => {
    try {
      // Không làm gì cả, giữ người dùng mặc định
      toast.success('Đăng xuất thành công!');
      // Ở lại trang hiện tại, không chuyển hướng
    } catch (error) {
      console.error('Error in mock sign out:', error);
      toast.error('Đã xảy ra lỗi khi đăng xuất');
    }
  };

  // Quên mật khẩu - luôn thành công
  const forgotPassword = async (email: string) => {
    toast.success('Email đặt lại mật khẩu đã được gửi thành công!');
  };

  // Đặt lại mật khẩu - luôn thành công
  const resetPassword = async (password: string, token: string) => {
    toast.success('Mật khẩu đã được đặt lại thành công!');
    router.push(ROUTES.DASHBOARD);
  };

  // Giá trị context
  const value = {
    user,
    isLoading,
    isAuthenticated: true, // Luôn trả về true
    signIn,
    signUp,
    signOut,
    forgotPassword,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 