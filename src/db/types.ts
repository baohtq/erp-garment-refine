export type Supplier = {
  id: number | string;
  code: string;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  contact_person?: string;
  status: string;
  supplier_type?: string;
  tax_id?: string;
  payment_terms?: string;
  notes?: string;
  website?: string;
  created_at: string;
  updated_at: string;
};

export type SupplierContact = {
  id: number | string;
  supplier_id: number | string;
  name: string;
  position?: string;
  department?: string;
  email?: string;
  phone?: string;
  is_primary?: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
  supplier?: Supplier;
};

export type SupplierTransaction = {
  id: number | string;
  supplier_id: number | string;
  transaction_date: string;
  transaction_type: string;
  amount: number;
  description?: string;
  document_no?: string;
  status: string;
  created_at: string;
  updated_at: string;
  supplier?: Supplier;
};

export type SupplierRating = {
  id: number | string;
  supplier_id: number | string;
  rating_date: string;
  quality_score: number;
  delivery_score: number;
  price_score: number;
  service_score: number;
  overall_score: number;
  feedback?: string;
  rated_by?: string;
  created_at: string;
  updated_at: string;
  supplier?: Supplier;
};

export type SupplierContract = {
  id: number | string;
  supplier_id: number | string;
  contract_no: string;
  contract_date: string;
  start_date: string;
  end_date?: string;
  contract_type?: string;
  total_value?: number;
  payment_terms?: string;
  delivery_terms?: string;
  status: string;
  file_url?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  supplier?: Supplier;
};

export type SupplierContractPayment = {
  id: number | string;
  contract_id: number | string;
  payment_date: string;
  amount: number;
  payment_method?: string;
  reference_no?: string;
  status: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  contract?: SupplierContract;
};

export type Employee = {
  id: number;
  code: string;
  name: string;
  department?: string;
  position?: string;
  phone?: string;
  email?: string;
  hire_date?: string;
  status: string;
  created_at: string;
  updated_at: string;
};

export type Material = {
  id: number;
  code: string;
  name: string;
  description?: string;
  unit: string;
  current_stock: number;
  min_stock: number;
  supplier_id?: number;
  status: string;
  created_at: string;
  updated_at: string;
  supplier?: Supplier;
};

export type Product = {
  id: number;
  code: string;
  name: string;
  description?: string;
  category?: string;
  unit: string;
  status: string;
  created_at: string;
  updated_at: string;
};

export type ProductStandard = {
  id: number;
  product_id: number;
  material_id: number;
  quantity: number;
  unit: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  product?: Product;
  material?: Material;
};

export type ProductionOrder = {
  id: number;
  order_no: string;
  product_id: number;
  quantity: number;
  start_date?: string;
  end_date?: string;
  status: string;
  priority: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  product?: Product;
};

export type ProductionStage = {
  id: number;
  name: string;
  sequence: number;
  description?: string;
  created_at: string;
  updated_at: string;
};

export type ProductionProgress = {
  id: number;
  production_order_id: number;
  stage_id: number;
  employee_id?: number;
  planned_start_date?: string;
  planned_end_date?: string;
  actual_start_date?: string;
  actual_end_date?: string;
  planned_quantity?: number;
  completed_quantity: number;
  defect_quantity: number;
  status: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  production_order?: ProductionOrder;
  stage?: ProductionStage;
  employee?: Employee;
};

export type FinishedProduct = {
  id: number;
  production_order_id: number;
  product_id: number;
  quantity: number;
  quality_check_status: string;
  warehouse_status: string;
  inspector_id?: number;
  inspection_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  production_order?: ProductionOrder;
  product?: Product;
  inspector?: Employee;
};

export type MaterialReceipt = {
  id: number;
  receipt_no: string;
  supplier_id?: number;
  receive_date: string;
  status: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  supplier?: Supplier;
};

export type MaterialReceiptItem = {
  id: number;
  material_receipt_id: number;
  material_id: number;
  quantity: number;
  unit_price?: number;
  received_quantity: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  material_receipt?: MaterialReceipt;
  material?: Material;
};

export type MaterialIssue = {
  id: number;
  issue_no: string;
  production_order_id: number;
  issue_date: string;
  status: string;
  issued_by?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  production_order?: ProductionOrder;
  employee?: Employee;
};

export type MaterialIssueItem = {
  id: number;
  material_issue_id: number;
  material_id: number;
  planned_quantity: number;
  issued_quantity: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  material_issue?: MaterialIssue;
  material?: Material;
};

export type EmployeeProductivity = {
  id: number;
  employee_id: number;
  production_progress_id: number;
  date: string;
  working_hours: number;
  quantity_produced: number;
  efficiency?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  employee?: Employee;
  production_progress?: ProductionProgress;
}; 