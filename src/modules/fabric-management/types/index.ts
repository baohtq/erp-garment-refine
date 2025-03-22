// Fabric types
export interface Fabric {
  id: string;
  code: string;
  name: string;
  type: string;
  color: string;
  width: number;
  composition: string;
  weight: number;
  supplier: string;
  price: number;
  moq: number;
  leadTime: number;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  updatedAt: string;
}

// Fabric inventory types
export interface FabricInventory {
  id: string;
  fabricId: string;
  fabricCode: string;
  fabricName: string;
  totalQuantity: number;
  availableQuantity: number;
  allocatedQuantity: number;
  unit: string;
  warehouseId: string;
  warehouseName: string;
  locationId: string;
  locationName: string;
  batchNumber: string;
  receiptDate: string;
  expiryDate?: string;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
  lastUpdated: string;
}

// Cutting order types
export interface CuttingOrder {
  id: string;
  orderNumber: string;
  fabricId: string;
  fabricCode: string;
  fabricName: string;
  quantity: number;
  unit: string;
  styleNumber: string;
  styleName: string;
  size: string;
  color: string;
  requestedBy: string;
  requestedDate: string;
  plannedCutDate: string;
  actualCutDate?: string;
  status: 'pending' | 'approved' | 'in-progress' | 'completed' | 'cancelled';
  notes?: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  createdAt: string;
  updatedAt: string;
}

// Issue record types
export interface IssueRecord {
  id: string;
  issueNumber: string;
  fabricId: string;
  fabricCode: string;
  fabricName: string;
  quantity: number;
  unit: string;
  issuedTo: string;
  issuedBy: string;
  issuedDate: string;
  reason: string;
  productionOrderId?: string;
  productionOrderNumber?: string;
  department: string;
  location: string;
  status: 'pending' | 'issued' | 'returned' | 'cancelled';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Inventory check types
export interface InventoryCheck {
  id: string;
  checkNumber: string;
  warehouseId: string;
  warehouseName: string;
  scheduledDate: string;
  actualDate?: string;
  conductor: string;
  supervisor?: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  discrepancies: InventoryDiscrepancy[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryCheckItem {
  id?: string;
  checkId?: string;
  fabricId: string;
  fabricCode: string;
  fabricName: string;
  expectedQuantity: number;
  actualQuantity: number;
  unit: string;
  locationId: string;
  locationName: string;
  batch: string;
  notes?: string;
}

export interface InventoryDiscrepancy {
  id: string;
  fabricId: string;
  fabricCode: string;
  fabricName: string;
  expectedQuantity: number;
  actualQuantity: number;
  discrepancyQuantity: number;
  reason?: string;
  actionTaken?: string;
  status: 'pending' | 'resolved' | 'investigating';
}

// Quality control record types
export interface QualityControlRecord {
  id: string;
  inspectionNumber: string;
  fabricId: string;
  fabricCode: string;
  fabricName: string;
  batchNumber: string;
  inspectionDate: string;
  inspector: string;
  inspectionType: 'receiving' | 'in-process' | 'pre-cutting' | 'final';
  sampleSize: number;
  defectRate: number;
  passFailCriteria: string;
  result: 'pass' | 'fail' | 'conditional';
  defects: FabricDefect[];
  notes?: string;
  approvedBy?: string;
  approvalDate?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface FabricDefect {
  id: string;
  type: string;
  description: string;
  severity: 'minor' | 'major' | 'critical';
  location: string;
  quantity: number;
  image?: string;
}

// Employee type
export interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  role: string;
  status: 'active' | 'inactive';
  joinDate: string;
}

// Common types
export type Status = 
  | 'active' 
  | 'inactive' 
  | 'pending' 
  | 'in-stock' 
  | 'low-stock' 
  | 'out-of-stock' 
  | 'approved'
  | 'in-progress'
  | 'completed'
  | 'cancelled'
  | 'issued'
  | 'returned'
  | 'scheduled'
  | 'rejected'
  | 'resolved'
  | 'investigating'
  | 'pass'
  | 'fail'
  | 'conditional';

export type Priority = 'low' | 'normal' | 'high' | 'urgent'; 