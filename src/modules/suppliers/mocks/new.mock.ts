import {
  Supplier,
  SupplierContact,
  SupplierContract,
  SupplierContractPayment,
  SupplierTransaction,
  SupplierRating,
  Status,
  TransactionType,
  ContractType,
  PaymentMethod,
  SupplierType
} from "@/types/db";

// Định nghĩa kiểu dữ liệu
export interface Supplier {
  id: number;
  name: string;
  code: string;
  contact_name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  country: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

// Dữ liệu mock cho nhà cung cấp
export const suppliers: Supplier[] = [
  {
    id: 1,
    name: 'Vải Nam Định',
    code: 'SUP001',
    contact_name: 'Nguyễn Văn Nam',
    phone: '0912345678',
    email: 'info@vainamdinh.com',
    address: '100 Đường Giải Phóng',
    city: 'Nam Định',
    country: 'Việt Nam',
    status: 'active',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z'
  },
  {
    id: 2,
    name: 'Dệt may Thành Công',
    code: 'SUP002',
    contact_name: 'Trần Thị Hương',
    phone: '0923456789',
    email: 'sales@thanhcong.com',
    address: '36 Tây Thạnh, Tân Phú',
    city: 'Hồ Chí Minh',
    country: 'Việt Nam',
    status: 'active',
    created_at: '2023-01-05T00:00:00Z',
    updated_at: '2023-01-05T00:00:00Z'
  },
  {
    id: 3,
    name: 'Lụa Bảo Lộc',
    code: 'SUP003',
    contact_name: 'Lê Minh Tâm',
    phone: '0934567890',
    email: 'contact@luabaoloc.com',
    address: '25 Bình Minh',
    city: 'Bảo Lộc',
    country: 'Việt Nam',
    status: 'active',
    created_at: '2023-01-10T00:00:00Z',
    updated_at: '2023-01-10T00:00:00Z'
  },
  {
    id: 4,
    name: 'Vải Cotton Hà Nội',
    code: 'SUP004',
    contact_name: 'Phạm Văn Long',
    phone: '0945678901',
    email: 'sales@cottonnhanoi.com',
    address: '15 Phố Hàng Bông',
    city: 'Hà Nội',
    country: 'Việt Nam',
    status: 'inactive',
    created_at: '2023-01-15T00:00:00Z',
    updated_at: '2023-03-01T00:00:00Z'
  },
  {
    id: 5,
    name: 'Nhập khẩu vải Trung Quốc',
    code: 'SUP005',
    contact_name: 'Hoàng Thị Lan',
    phone: '0956789012',
    email: 'import@vaitrungquoc.com',
    address: '78 Đường Lê Lợi',
    city: 'Lạng Sơn',
    country: 'Việt Nam',
    status: 'active',
    created_at: '2023-02-01T00:00:00Z',
    updated_at: '2023-02-01T00:00:00Z'
  }
];

// Mock data cho người liên hệ
export const mockSupplierContacts: SupplierContact[] = [
  {
    id: '1',
    supplier_id: '1',
    name: 'Nguyễn Văn A',
    position: 'Giám đốc kinh doanh',
    department: 'Kinh doanh',
    email: 'nguyenvana@vainamdinh.com',
    phone: '0912345678',
    is_primary: true,
    notes: 'Liên hệ chính về đơn hàng',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-06-15T00:00:00Z'
  },
  {
    id: '2',
    supplier_id: '1',
    name: 'Nguyễn Thị X',
    position: 'Kế toán trưởng',
    department: 'Tài chính',
    email: 'nguyenthix@vainamdinh.com',
    phone: '0912345679',
    is_primary: false,
    notes: 'Liên hệ về thanh toán',
    created_at: '2023-01-02T00:00:00Z',
    updated_at: '2023-06-16T00:00:00Z'
  },
  {
    id: '3',
    supplier_id: '2',
    name: 'Trần Thị B',
    position: 'Giám đốc',
    department: 'Ban giám đốc',
    email: 'tranthib@phulieuabc.com',
    phone: '0909123456',
    is_primary: true,
    notes: 'Người đại diện pháp luật',
    created_at: '2023-02-10T00:00:00Z',
    updated_at: '2023-07-20T00:00:00Z'
  },
  {
    id: '4',
    supplier_id: '3',
    name: 'Phạm Văn C',
    position: 'Trưởng phòng kinh doanh',
    department: 'Kinh doanh',
    email: 'phamvanc@chihanoi.com',
    phone: '0977888999',
    is_primary: true,
    notes: 'Phụ trách khu vực miền Bắc',
    created_at: '2023-03-05T00:00:00Z',
    updated_at: '2023-08-12T00:00:00Z'
  },
  {
    id: '5',
    supplier_id: '5',
    name: 'Hoàng Văn E',
    position: 'Điều phối viên',
    department: 'Logistics',
    email: 'hoangvane@xyz.com',
    phone: '0855666777',
    is_primary: true,
    notes: 'Phụ trách điều phối vận chuyển',
    created_at: '2023-05-20T00:00:00Z',
    updated_at: '2023-10-10T00:00:00Z'
  }
];

// Mock data cho hợp đồng
export const mockSupplierContracts: SupplierContract[] = [
  {
    id: '1',
    supplier_id: '1',
    contract_no: 'HĐ-2023-001',
    contract_date: '2023-01-15T00:00:00Z',
    start_date: '2023-02-01T00:00:00Z',
    end_date: '2024-01-31T00:00:00Z',
    contract_type: ContractType.PURCHASE,
    total_value: 500000000,
    payment_terms: 'Thanh toán 30% trước, 70% sau khi giao hàng',
    delivery_terms: 'Giao hàng trong vòng 15 ngày sau khi đặt hàng',
    status: Status.ACTIVE,
    file_url: 'https://example.com/contracts/HD-2023-001.pdf',
    notes: 'Hợp đồng cung cấp vải năm 2023',
    created_at: '2023-01-15T00:00:00Z',
    updated_at: '2023-01-15T00:00:00Z'
  },
  {
    id: '2',
    supplier_id: '2',
    contract_no: 'HĐ-2023-002',
    contract_date: '2023-02-20T00:00:00Z',
    start_date: '2023-03-01T00:00:00Z',
    end_date: '2023-12-31T00:00:00Z',
    contract_type: ContractType.FRAMEWORK,
    total_value: 200000000,
    payment_terms: 'Thanh toán theo từng đợt giao hàng',
    delivery_terms: 'Giao hàng hàng tháng',
    status: Status.ACTIVE,
    file_url: 'https://example.com/contracts/HD-2023-002.pdf',
    notes: 'Hợp đồng khung cung cấp phụ liệu',
    created_at: '2023-02-20T00:00:00Z',
    updated_at: '2023-02-20T00:00:00Z'
  },
  {
    id: '3',
    supplier_id: '5',
    contract_no: 'HĐ-2023-003',
    contract_date: '2023-05-25T00:00:00Z',
    start_date: '2023-06-01T00:00:00Z',
    end_date: '2024-05-31T00:00:00Z',
    contract_type: ContractType.SERVICE,
    total_value: 120000000,
    payment_terms: 'Thanh toán hàng tháng',
    delivery_terms: 'Cung cấp dịch vụ liên tục',
    status: Status.ACTIVE,
    file_url: 'https://example.com/contracts/HD-2023-003.pdf',
    notes: 'Hợp đồng dịch vụ vận chuyển hàng hóa',
    created_at: '2023-05-25T00:00:00Z',
    updated_at: '2023-05-25T00:00:00Z'
  },
  {
    id: '4',
    supplier_id: '3',
    contract_no: 'HĐ-2023-004',
    contract_date: '2023-07-10T00:00:00Z',
    start_date: '2023-08-01T00:00:00Z',
    end_date: '2024-07-31T00:00:00Z',
    contract_type: ContractType.EXCLUSIVITY,
    total_value: 300000000,
    payment_terms: 'Thanh toán 50% trước, 50% sau khi giao hàng',
    delivery_terms: 'Giao hàng theo đợt, mỗi đợt cách nhau 3 tháng',
    status: Status.ACTIVE,
    file_url: 'https://example.com/contracts/HD-2023-004.pdf',
    notes: 'Hợp đồng độc quyền cung cấp chỉ may',
    created_at: '2023-07-10T00:00:00Z',
    updated_at: '2023-07-10T00:00:00Z'
  }
];

// Các hàm utility để lấy dữ liệu mock
export const getSupplierById = (id: string | number): Supplier | undefined => {
  return suppliers.find(supplier => supplier.id === id);
};

export const getContactsBySupplier = (supplierId: string | number): SupplierContact[] => {
  return mockSupplierContacts.filter(contact => contact.supplier_id === supplierId);
};

export const getContractsBySupplier = (supplierId: string | number): SupplierContract[] => {
  return mockSupplierContracts.filter(contract => contract.supplier_id === supplierId);
};

export const getContractById = (id: string | number): SupplierContract | undefined => {
  return mockSupplierContracts.find(contract => contract.id === id);
}; 