"use client";

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import toast from 'react-hot-toast';

import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage
} from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Loader2, LockKeyhole, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';

const formSchema = z.object({
  password: z.string().min(6, {
    message: "Mật khẩu phải có ít nhất 6 ký tự",
  }),
  confirmPassword: z.string().min(6, {
    message: "Mật khẩu xác nhận phải có ít nhất 6 ký tự",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"],
});

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [resetError, setResetError] = useState('');
  const [isResetSuccessful, setIsResetSuccessful] = useState(false);
  const supabase = createClientComponentClient();
  
  // Kiểm tra xem URL có chứa token và email không
  useEffect(() => {
    // Với Supabase, nó sẽ tự động xử lý token và session từ URL
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      if (error || !data.session) {
        toast.error('Phiên đặt lại mật khẩu không hợp lệ hoặc đã hết hạn');
        setTimeout(() => {
          router.push('/forgot-password');
        }, 2000);
      }
    };
    
    checkSession();
  }, [router, supabase.auth]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResetError('');

    try {
      // Cập nhật mật khẩu
      const { error } = await supabase.auth.updateUser({
        password: values.password,
      });

      if (error) {
        throw error;
      }

      setIsResetSuccessful(true);
      toast.success('Mật khẩu đã được đặt lại thành công!');
      
      // Chuyển hướng sau khi đặt lại mật khẩu thành công
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (error: any) {
      console.error('Reset password error:', error);
      setResetError(error.message || 'Đã xảy ra lỗi khi đặt lại mật khẩu');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center justify-center text-center">
          <h1 className="text-4xl font-bold">Đặt lại mật khẩu</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Tạo mật khẩu mới cho tài khoản của bạn
          </p>
        </div>

        {resetError && (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>{resetError}</AlertDescription>
          </Alert>
        )}

        {isResetSuccessful ? (
          <div className="rounded-lg border border-green-100 bg-green-50 p-6 dark:border-green-900 dark:bg-green-900/20">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <CheckCircle2 className="h-12 w-12 text-green-500" />
              <h2 className="text-xl font-semibold">Mật khẩu đã được đặt lại!</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Mật khẩu của bạn đã được cập nhật thành công. Bạn sẽ được chuyển hướng đến trang đăng nhập trong vài giây.
              </p>
              <Button asChild>
                <Link href="/login" className="flex items-center gap-2">
                  Đến trang đăng nhập
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mật khẩu mới</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                          <Input 
                            type="password" 
                            placeholder="••••••••" 
                            className="pl-10" 
                            disabled={isLoading}
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Xác nhận mật khẩu mới</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                          <Input 
                            type="password" 
                            placeholder="••••••••" 
                            className="pl-10" 
                            disabled={isLoading}
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    'Cập nhật mật khẩu'
                  )}
                </Button>
              </form>
            </Form>

            <div className="mt-6 text-center">
              <Link 
                href="/login" 
                className="flex items-center justify-center gap-2 text-sm font-medium text-primary hover:text-primary/90"
              >
                <ArrowLeft className="h-4 w-4" />
                Quay lại đăng nhập
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 