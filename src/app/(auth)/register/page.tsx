"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import toast from 'react-hot-toast';

import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  FormDescription
} from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Loader2, Mail, LockKeyhole, User, Building } from 'lucide-react';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';

const formSchema = z.object({
  fullName: z.string().min(2, {
    message: "Họ tên phải có ít nhất 2 ký tự",
  }),
  company: z.string().optional(),
  email: z.string().email({
    message: "Email không hợp lệ",
  }),
  password: z.string().min(6, {
    message: "Mật khẩu phải có ít nhất 6 ký tự",
  }),
  confirmPassword: z.string().min(6, {
    message: "Mật khẩu xác nhận phải có ít nhất 6 ký tự",
  }),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: "Bạn phải đồng ý với điều khoản sử dụng",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"],
});

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [registerError, setRegisterError] = useState('');
  const supabase = createClientComponentClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      company: '',
      email: '',
      password: '',
      confirmPassword: '',
      termsAccepted: false,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setRegisterError('');

    try {
      // Đăng ký người dùng mới với Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            full_name: values.fullName,
            company: values.company || '',
          },
        },
      });

      if (error) {
        throw error;
      }

      if (data?.user) {
        // Thêm thông tin người dùng vào bảng profiles
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              full_name: values.fullName,
              email: values.email,
              company: values.company || '',
              role: 'user',
              created_at: new Date().toISOString(),
            },
          ]);

        if (profileError) {
          console.error('Error creating profile:', profileError);
          throw profileError;
        }

        toast.success('Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.');
        router.push('/login');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      if (error.message.includes('already registered')) {
        setRegisterError('Email đã được sử dụng. Vui lòng chọn email khác hoặc đăng nhập.');
      } else {
        setRegisterError(error.message || 'Đã xảy ra lỗi khi đăng ký');
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center justify-center text-center">
          <h1 className="text-4xl font-bold">Đăng ký tài khoản</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Tạo tài khoản mới để sử dụng ứng dụng
          </p>
        </div>

        {registerError && (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>{registerError}</AlertDescription>
          </Alert>
        )}

        <div className="mt-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Họ và tên</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input 
                          placeholder="Nguyễn Văn A" 
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
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Công ty <span className="text-sm text-muted-foreground">(tùy chọn)</span></FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input 
                          placeholder="Công ty TNHH ABC" 
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
                    <FormDescription>
                      Email này sẽ được sử dụng để đăng nhập và nhận thông báo
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mật khẩu</FormLabel>
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
                    <FormLabel>Xác nhận mật khẩu</FormLabel>
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
                name="termsAccepted"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-sm font-normal">
                        Tôi đồng ý với{' '}
                        <Link 
                          href="/terms" 
                          className="text-primary hover:text-primary/90"
                        >
                          điều khoản sử dụng
                        </Link>{' '}
                        và{' '}
                        <Link 
                          href="/privacy" 
                          className="text-primary hover:text-primary/90"
                        >
                          chính sách bảo mật
                        </Link>
                      </FormLabel>
                      <FormMessage />
                    </div>
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
                    Đang đăng ký...
                  </>
                ) : (
                  'Đăng ký'
                )}
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              Đã có tài khoản?{' '}
            </span>
            <Link 
              href="/login" 
              className="font-medium text-primary hover:text-primary/90"
            >
              Đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 