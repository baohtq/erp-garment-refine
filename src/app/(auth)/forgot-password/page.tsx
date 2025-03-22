"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
import { Loader2, Mail, ArrowLeft } from 'lucide-react';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';

const formSchema = z.object({
  email: z.string().email({
    message: "Email không hợp lệ",
  }),
});

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [requestError, setRequestError] = useState('');
  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false);
  const supabase = createClientComponentClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setRequestError('');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        throw error;
      }

      setIsSubmitSuccessful(true);
      toast.success('Đã gửi email đặt lại mật khẩu. Vui lòng kiểm tra hộp thư của bạn.');
    } catch (error: any) {
      console.error('Reset password error:', error);
      setRequestError(error.message || 'Đã xảy ra lỗi khi gửi yêu cầu đặt lại mật khẩu');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center justify-center text-center">
          <h1 className="text-4xl font-bold">Quên mật khẩu</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Nhập email của bạn để nhận liên kết đặt lại mật khẩu
          </p>
        </div>

        {requestError && (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>{requestError}</AlertDescription>
          </Alert>
        )}

        {isSubmitSuccessful ? (
          <div className="rounded-lg border border-green-100 bg-green-50 p-6 dark:border-green-900 dark:bg-green-900/20">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <Mail className="h-12 w-12 text-green-500" />
              <h2 className="text-xl font-semibold">Kiểm tra email của bạn</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Chúng tôi đã gửi email chứa liên kết đặt lại mật khẩu đến {form.getValues().email}. 
                Vui lòng kiểm tra hộp thư đến (và thư mục spam) của bạn.
              </p>
              <div className="flex gap-4 pt-4">
                <Button variant="outline" asChild>
                  <Link href="/login" className="flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Quay lại đăng nhập
                  </Link>
                </Button>
                <Button onClick={() => setIsSubmitSuccessful(false)}>
                  Thử với email khác
                </Button>
              </div>
            </div>
          </div>
        ) : (
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
                      <FormDescription>
                        Nhập email mà bạn đã sử dụng để đăng ký tài khoản
                      </FormDescription>
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
                      Đang gửi yêu cầu...
                    </>
                  ) : (
                    'Gửi liên kết đặt lại mật khẩu'
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