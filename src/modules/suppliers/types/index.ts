// Re-export all types from this module
export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  materials: string[];
  rating: number;
  status: 'active' | 'inactive';
}

export interface SupplierTransaction {
  id: string;
  supplierId: string;
  date: string;
  amount: number;
  type: 'purchase' | 'payment';
  status: 'pending' | 'completed' | 'cancelled';
  notes?: string;
}

export interface SupplierRating {
  id: string;
  supplierId: string;
  date: string;
  rating: number;
  comment: string;
} 