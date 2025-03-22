'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/providers/auth';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/shared/components/ui/card';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Loader2, User, Mail, Building, Camera } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/shared/components/ui/avatar';
import toast from 'react-hot-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';

const profileFormSchema = z.object({
  fullName: z.string().min(2, 'Họ tên phải có ít nhất 2 ký tự'),
  email: z.string().email('Email không hợp lệ'),
  company: z.string().optional(),
});

const securityFormSchema = z.object({
  currentPassword: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  newPassword: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  confirmPassword: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Mật khẩu không khớp",
  path: ["confirmPassword"],
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;
type SecurityFormValues = z.infer<typeof securityFormSchema>;

export default function ProfilePage() {
  const { user, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSecurityLoading, setIsSecurityLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(user?.avatar);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const supabase = createClientComponentClient();

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      fullName: user?.fullName || '',
      email: user?.email || '',
      company: user?.company || '',
    },
  });

  const securityForm = useForm<SecurityFormValues>({
    resolver: zodResolver(securityFormSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  async function onProfileSubmit(data: ProfileFormValues) {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Cập nhật thông tin trong bảng profiles
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: data.fullName,
          company: data.company,
        })
        .eq('id', user.id);

      if (error) {
        toast.error('Lỗi khi cập nhật thông tin: ' + error.message);
        return;
      }

      toast.success('Thông tin cá nhân đã được cập nhật thành công!');
    } catch (error: any) {
      toast.error('Đã xảy ra lỗi: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function onSecuritySubmit(data: SecurityFormValues) {
    setIsSecurityLoading(true);
    try {
      // Kiểm tra mật khẩu hiện tại
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email || '',
        password: data.currentPassword,
      });

      if (signInError) {
        toast.error('Mật khẩu hiện tại không chính xác');
        setIsSecurityLoading(false);
        return;
      }

      // Cập nhật mật khẩu mới
      const { error: updateError } = await supabase.auth.updateUser({
        password: data.newPassword,
      });

      if (updateError) {
        toast.error('Lỗi khi cập nhật mật khẩu: ' + updateError.message);
        return;
      }

      toast.success('Mật khẩu đã được cập nhật thành công!');
      securityForm.reset({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error: any) {
      toast.error('Đã xảy ra lỗi: ' + error.message);
    } finally {
      setIsSecurityLoading(false);
    }
  }

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }

    const file = event.target.files[0];
    const fileExt = file.name.split('.').pop();
    const filePath = `avatars/${user?.id}-${Math.random()}.${fileExt}`;

    setUploading(true);
    setUploadProgress(0);

    try {
      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          avatar_url: urlData.publicUrl,
        })
        .eq('id', user?.id);

      if (updateError) {
        throw updateError;
      }

      setAvatarUrl(urlData.publicUrl);
      toast.success('Ảnh đại diện đã được cập nhật!');
    } catch (error: any) {
      toast.error('Lỗi khi tải lên ảnh: ' + error.message);
    } finally {
      setUploading(false);
      setUploadProgress(100);
      // Reset progress after animation completes
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Hồ sơ cá nhân</h1>
        <p className="text-muted-foreground">
          Quản lý thông tin cá nhân và thiết lập bảo mật tài khoản của bạn
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full md:w-[400px] grid-cols-2">
          <TabsTrigger value="profile">Thông tin cá nhân</TabsTrigger>
          <TabsTrigger value="security">Bảo mật</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Ảnh đại diện</CardTitle>
                <CardDescription>
                  Chọn một ảnh đại diện cho tài khoản của bạn
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center space-y-4">
                <div className="relative">
                  <Avatar className="h-32 w-32">
                    <AvatarImage src={avatarUrl} alt={user?.fullName} />
                    <AvatarFallback className="text-2xl">
                      {user?.fullName?.substring(0, 2).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  
                  {uploadProgress > 0 && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
                      <span className="text-white font-medium">{uploadProgress}%</span>
                    </div>
                  )}
                  
                  <label 
                    className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white cursor-pointer"
                    htmlFor="avatar-upload"
                  >
                    {uploading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Camera className="h-4 w-4" />
                    )}
                  </label>
                  <input 
                    id="avatar-upload" 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleAvatarChange}
                    disabled={uploading}
                  />
                </div>
                <div className="text-center">
                  <p className="font-medium">{user?.fullName}</p>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Thông tin cá nhân</CardTitle>
                <CardDescription>
                  Cập nhật thông tin cá nhân của bạn
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...profileForm}>
                  <form
                    onSubmit={profileForm.handleSubmit(onProfileSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={profileForm.control}
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
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={profileForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                              <Input
                                placeholder="example@company.com"
                                className="pl-10"
                                {...field}
                                disabled
                              />
                            </div>
                          </FormControl>
                          <FormDescription>
                            Email không thể thay đổi sau khi đăng ký
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={profileForm.control}
                      name="company"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Công ty</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                              <Input
                                placeholder="Công ty TNHH ABC"
                                className="pl-10"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Đang cập nhật...
                        </>
                      ) : (
                        'Cập nhật thông tin'
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Đổi mật khẩu</CardTitle>
              <CardDescription>
                Cập nhật mật khẩu của bạn để tăng cường bảo mật
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...securityForm}>
                <form
                  onSubmit={securityForm.handleSubmit(onSecuritySubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={securityForm.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mật khẩu hiện tại</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={securityForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mật khẩu mới</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={securityForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Xác nhận mật khẩu mới</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isSecurityLoading || !securityForm.formState.isDirty}
                  >
                    {isSecurityLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Đang cập nhật...
                      </>
                    ) : (
                      'Cập nhật mật khẩu'
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex flex-col items-start px-6 text-sm text-muted-foreground">
              <p>Mật khẩu của bạn nên:</p>
              <ul className="ml-4 list-disc">
                <li>Có ít nhất 8 ký tự</li>
                <li>Bao gồm ít nhất một chữ số</li>
                <li>Bao gồm ít nhất một ký tự đặc biệt</li>
                <li>Không trùng với mật khẩu đã sử dụng trước đây</li>
              </ul>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 