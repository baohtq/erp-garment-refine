import type { Metadata } from 'next';
import { APP_NAME } from '@/config/constants';

// Metadata must be exported from a Server Component or dedicated metadata file
export const metadata: Metadata = {
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description: 'Hệ thống quản lý may mặc ERP xây dựng trên Refine và Supabase',
  keywords: ['erp', 'garment', 'textile', 'manufacturing', 'refine', 'supabase'],
  icons: {
    icon: "/favicon.ico",
  },
}; 