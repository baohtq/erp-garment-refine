/**
 * index.ts - Barrel file cho schema và RLS policies
 */

import fs from 'fs';
import path from 'path';

// Đọc nội dung của các file SQL
export const databaseSchema = fs.readFileSync(path.join(__dirname, './schema.sql'), 'utf8');
export const rlsPolicies = fs.readFileSync(path.join(__dirname, './rls-policies.sql'), 'utf8');

// Export các constants hữu ích
export const DB_TABLES = {
  SUPPLIERS: 'suppliers',
  EMPLOYEES: 'employees',
  MATERIALS: 'materials',
  PRODUCTS: 'products',
  PRODUCT_STANDARDS: 'product_standards',
  PRODUCTION_ORDERS: 'production_orders',
  PRODUCTION_STAGES: 'production_stages',
  PRODUCTION_PROGRESS: 'production_progress',
  FINISHED_PRODUCTS: 'finished_products',
  MATERIAL_RECEIPTS: 'material_receipts',
  MATERIAL_RECEIPT_ITEMS: 'material_receipt_items',
  MATERIAL_ISSUES: 'material_issues',
  MATERIAL_ISSUE_ITEMS: 'material_issue_items',
  EMPLOYEE_PRODUCTIVITY: 'employee_productivity',
  USER_ROLES: 'user_roles'
};

export const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  PRODUCTION: 'production',
  WAREHOUSE: 'warehouse',
  HR: 'hr',
  QUALITY: 'quality'
};

export const STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
  COMPLETED: 'completed',
  IN_PROGRESS: 'in-progress',
  DRAFT: 'draft',
  CANCELLED: 'cancelled'
}; 