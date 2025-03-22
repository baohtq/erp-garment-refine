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
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClientComponentClient();

  // Kiểm tra xem người dùng đã đăng nhập chưa
  useEffect(() => {
    const checkUserSession = async () => {
      setIsLoading(true);
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error fetching session:', error);
          setUser(null);
          return;
        }
        
        if (session?.user) {
          // Lấy thông tin người dùng từ bảng profiles
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (profileError) {
            console.error('Error fetching user profile:', profileError);
            setUser(null);
            return;
          }
          
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            fullName: profileData?.full_name || '',
            role: profileData?.role || 'user',
            company: profileData?.company || '',
            avatar: profileData?.avatar_url || '',
          });
          
          // Chuyển hướng nếu đang ở trang auth
          if (AUTH_ROUTES.some(route => pathname.startsWith(route))) {
            router.push(ROUTES.DASHBOARD);
          }
        } else {
          setUser(null);
          
          // Chuyển hướng đến trang đăng nhập nếu không phải trang auth
          if (!AUTH_ROUTES.some(route => pathname.startsWith(route)) && pathname !== '/') {
            router.push(ROUTES.LOGIN);
          }
        }
      } catch (error) {
        console.error('Authentication error:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserSession();

    // Lắng nghe sự kiện thay đổi auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          checkUserSession();
        }
        if (event === 'SIGNED_OUT') {
          setUser(null);
          router.push(ROUTES.LOGIN);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, router, pathname]);

  // Đăng nhập
  const signIn = async (email: string, password: string, rememberMe = false) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success('Đăng nhập thành công!');
      router.push(ROUTES.DASHBOARD);
    } catch (error: any) {
      toast.error('Đăng nhập thất bại: ' + error.message);
      console.error('Sign in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Đăng ký
  const signUp = async (
    email: string, 
    password: string, 
    userData: Omit<UserData, 'id'>
  ) => {
    setIsLoading(true);
    try {
      // Đăng ký người dùng
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData.fullName,
          },
        },
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      if (data.user) {
        // Tạo profile cho người dùng
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              full_name: userData.fullName,
              role: 'user',
              company: userData.company,
            },
          ]);

        if (profileError) {
          toast.error('Lỗi khi tạo hồ sơ người dùng');
          console.error('Profile creation error:', profileError);
          return;
        }

        toast.success('Đăng ký thành công! Vui lòng xác nhận email của bạn.');
        router.push(ROUTES.LOGIN);
      }
    } catch (error: any) {
      toast.error('Đăng ký thất bại: ' + error.message);
      console.error('Sign up error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Đăng xuất
  const signOut = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error(error.message);
        return;
      }
      
      setUser(null);
      toast.success('Đăng xuất thành công!');
      router.push(ROUTES.LOGIN);
    } catch (error: any) {
      toast.error('Đăng xuất thất bại: ' + error.message);
      console.error('Sign out error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Quên mật khẩu
  const forgotPassword = async (email: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}${ROUTES.RESET_PASSWORD}`,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success('Email đặt lại mật khẩu đã được gửi thành công!');
    } catch (error: any) {
      toast.error('Gửi email đặt lại mật khẩu thất bại: ' + error.message);
      console.error('Forgot password error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Đặt lại mật khẩu
  const resetPassword = async (password: string, token: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success('Mật khẩu đã được đặt lại thành công!');
      router.push(ROUTES.LOGIN);
    } catch (error: any) {
      toast.error('Đặt lại mật khẩu thất bại: ' + error.message);
      console.error('Reset password error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Giá trị context
  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signOut,
    forgotPassword,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 