// Global constants

// Application specific constants
export const APP_NAME = 'ERP Garment';
export const APP_VERSION = '1.0.0';
export const APP_COPYRIGHT = `© ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.`;

// API endpoints and configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Authentication settings
export const JWT_EXPIRY = 60 * 60 * 24 * 7; // 7 days
export const SESSION_STORAGE_KEY = 'erp-garment-auth';
export const AUTH_ROUTES = ['/login', '/register', '/forgot-password'];

// Pagination settings
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

// Date formats
export const DATE_FORMAT = 'dd/MM/yyyy';
export const DATE_TIME_FORMAT = 'dd/MM/yyyy HH:mm';

// Localization settings
export const DEFAULT_LOCALE = 'vi-VN';
export const SUPPORTED_LOCALES = ['vi-VN', 'en-US'];

// Navigation
export const SIDEBAR_WIDTH = 280;
export const TOPBAR_HEIGHT = 64;

// File upload
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
];

// Status values
export const STATUS_OPTIONS = [
  { value: 'active', label: 'Hoạt động' },
  { value: 'inactive', label: 'Không hoạt động' },
  { value: 'pending', label: 'Đang chờ xử lý' },
  { value: 'completed', label: 'Hoàn thành' },
  { value: 'cancelled', label: 'Đã hủy' }
];

// Business logic constants
export const VAT_RATE = 0.1; // 10%
export const DEFAULT_CURRENCY = 'VND';
export const DEFAULT_DECIMAL_PLACES = 0;
export const PRODUCTION_STATUSES = [
  'planning',
  'material_preparation',
  'cutting',
  'sewing',
  'quality_check',
  'packaging',
  'completed'
];

export const AUTH_COOKIE_NAME = 'erp-garment-auth';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  DASHBOARD: '/',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  // Product routes
  PRODUCTS: '/products',
  PRODUCT_CATEGORIES: '/product-categories',
  // Inventory routes
  INVENTORY: '/inventory',
  MATERIALS: '/materials',
  SUPPLIERS: '/suppliers',
  // Manufacturing routes
  MANUFACTURING: '/manufacturing',
  PRODUCTION_ORDERS: '/production-orders',
  WORK_CENTERS: '/work-centers',
  // Sales routes
  SALES: '/sales',
  CUSTOMERS: '/customers',
  ORDERS: '/orders',
  // Reports routes
  REPORTS: '/reports',
  FINANCIAL_REPORTS: '/reports/financial',
  PRODUCTION_REPORTS: '/reports/production',
  SALES_REPORTS: '/reports/sales',
}; 