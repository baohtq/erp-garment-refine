// Định nghĩa các kiểu dữ liệu cho module quản lý nhà cung cấp

// Nhà cung cấp
export interface Supplier {
  id: string | number;
  code: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  contact_person: string;
  status: string;
  supplier_type: string;
  tax_id?: string;
  payment_terms?: string;
  notes?: string;
  website?: string;
  created_at: string;
  updated_at?: string;
}

// Người liên hệ của nhà cung cấp
export interface SupplierContact {
  id: string | number;
  supplier_id: string | number;
  name: string;
  position?: string;
  department?: string;
  email?: string;
  phone?: string;
  is_primary: boolean;
  notes?: string;
  created_at: string;
  updated_at?: string;
}

// Hợp đồng với nhà cung cấp
export interface SupplierContract {
  id: string | number;
  supplier_id: string | number;
  contract_no: string;
  contract_date: string;
  start_date: string;
  end_date: string;
  contract_type: string;
  total_value: number;
  payment_terms?: string;
  delivery_terms?: string;
  status: string;
  file_url?: string;
  notes?: string;
  created_at: string;
  updated_at?: string;
}

// Thanh toán hợp đồng
export interface SupplierContractPayment {
  id: string | number;
  contract_id: string | number;
  payment_date: string;
  amount: number;
  payment_method: string;
  reference_no?: string;
  status: string;
  notes?: string;
  created_at: string;
  updated_at?: string;
}

// Giao dịch với nhà cung cấp
export interface SupplierTransaction {
  id: string | number;
  supplier_id: string | number;
  transaction_date: string;
  transaction_type: string;
  amount: number;
  description?: string;
  document_no?: string;
  status: string;
  created_at: string;
  updated_at?: string;
}

// Đánh giá nhà cung cấp
export interface SupplierRating {
  id: string | number;
  supplier_id: string | number;
  rating_date: string;
  quality_score: number;
  delivery_score: number;
  price_score: number;
  service_score: number;
  overall_score: number;
  feedback?: string;
  rated_by: string;
  created_at: string;
  updated_at?: string;
}

// Enum trạng thái chung
export enum Status {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

// Enum loại giao dịch nhà cung cấp
export enum TransactionType {
  PAYMENT = 'payment',
  REFUND = 'refund',
  DEPOSIT = 'deposit',
  ADJUSTMENT = 'adjustment'
}

// Enum loại hợp đồng
export enum ContractType {
  PURCHASE = 'purchase',
  SERVICE = 'service',
  FRAMEWORK = 'framework',
  EXCLUSIVITY = 'exclusivity'
}

// Enum phương thức thanh toán
export enum PaymentMethod {
  CASH = 'cash',
  BANK_TRANSFER = 'bank_transfer',
  CHECK = 'check',
  CREDIT = 'credit'
}

// Enum loại nhà cung cấp
export enum SupplierType {
  MANUFACTURER = 'manufacturer',
  WHOLESALER = 'wholesaler',
  DISTRIBUTOR = 'distributor',
  RETAILER = 'retailer',
  SERVICE = 'service'
} 