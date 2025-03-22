"use client";

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import toast from 'react-hot-toast';
import { useAuth } from '@/providers/auth';

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
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Loader2, Mail, LockKeyhole } from 'lucide-react';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';

const formSchema = z.object({
  email: z.string().email({
    message: "Email không hợp lệ",
  }),
  password: z.string().min(6, {
    message: "Mật khẩu phải có ít nhất 6 ký tự",
  }),
  rememberMe: z.boolean().default(false),
});

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const { signIn, isAuthenticated } = useAuth();
  const supabase = createClientComponentClient();

  // Nếu người dùng đã đăng nhập, chuyển hướng ngay về trang chủ
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: 'demo@example.com',
      password: 'password123',
      rememberMe: true,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      await signIn(values.email, values.password, values.rememberMe);
      toast.success('Đăng nhập thành công!');
      router.push('/');
    } catch (error) {
      console.error("Login error:", error);
      setLoginError('Đã xảy ra lỗi khi đăng nhập');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center justify-center text-center">
          <h1 className="text-4xl font-bold">Đăng nhập</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Đăng nhập để tiếp tục sử dụng ứng dụng
          </p>
        </div>

        {loginError && (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>{loginError}</AlertDescription>
          </Alert>
        )}

        <div className="mt-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input 
                          placeholder="email@company.com" 
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
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Mật khẩu</FormLabel>
                      <Link 
                        href="/forgot-password" 
                        className="text-sm font-medium text-primary hover:text-primary/90"
                      >
                        Quên mật khẩu?
                      </Link>
                    </div>
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

              <div className="flex items-center justify-between">
                <FormField
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm font-normal">
                          Ghi nhớ đăng nhập
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang đăng nhập...
                  </>
                ) : (
                  'Đăng nhập'
                )}
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              Chưa có tài khoản?{' '}
            </span>
            <Link 
              href="/register" 
              className="font-medium text-primary hover:text-primary/90"
            >
              Đăng ký
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 