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

// Mock data cho nhà cung cấp
export const mockSuppliers: Supplier[] = [
  {
    id: '1',
    code: 'SUP001',
    name: 'Vải Nam Định',
    address: '123 Đường Giải Phóng, Quận Hai Bà Trưng, Hà Nội',
    phone: '0912345678',
    email: 'contact@vainamdinh.com',
    contact_person: 'Nguyễn Văn A',
    status: Status.ACTIVE,
    supplier_type: SupplierType.MANUFACTURER,
    tax_id: '1234567890',
    payment_terms: 'Net 30',
    notes: 'Nhà cung cấp vải lớn tại miền Bắc',
    website: 'http://vainamdinh.com',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-06-15T00:00:00Z'
  },
  {
    id: '2',
    code: 'SUP002',
    name: 'Phụ kiện May ABC',
    address: '456 Lê Văn Sỹ, Quận 3, TP.HCM',
    phone: '0909123456',
    email: 'sales@phulieuabc.com',
    contact_person: 'Trần Thị B',
    status: Status.ACTIVE,
    supplier_type: SupplierType.DISTRIBUTOR,
    tax_id: '0987654321',
    payment_terms: 'Net 15',
    notes: 'Cung cấp các loại phụ liệu may mặc',
    website: 'http://phukienmaymacabc.com',
    created_at: '2023-02-10T00:00:00Z',
    updated_at: '2023-07-20T00:00:00Z'
  },
  {
    id: '3',
    code: 'SUP003',
    name: 'Chỉ may Hà Nội',
    address: '789 Đường Láng, Quận Đống Đa, Hà Nội',
    phone: '0977888999',
    email: 'info@chihanoi.com',
    contact_person: 'Phạm Văn C',
    status: Status.ACTIVE,
    supplier_type: SupplierType.WHOLESALER,
    tax_id: '5678901234',
    payment_terms: 'Net 45',
    notes: 'Chuyên cung cấp các loại chỉ may chất lượng cao',
    website: 'http://chimayhanoi.com',
    created_at: '2023-03-05T00:00:00Z',
    updated_at: '2023-08-12T00:00:00Z'
  },
  {
    id: '4',
    code: 'SUP004',
    name: 'Khóa kéo Sài Gòn',
    address: '101 Nguyễn Trãi, Quận 5, TP.HCM',
    phone: '0866777888',
    email: 'contact@khoakeo.com',
    contact_person: 'Lê Thị D',
    status: Status.INACTIVE,
    supplier_type: SupplierType.MANUFACTURER,
    tax_id: '2345678901',
    payment_terms: 'Net 60',
    notes: 'Nhà sản xuất khóa kéo hàng đầu Việt Nam',
    website: 'http://khoakeosaigon.com',
    created_at: '2023-04-12T00:00:00Z',
    updated_at: '2023-09-01T00:00:00Z'
  },
  {
    id: '5',
    code: 'SUP005',
    name: 'Dịch vụ Vận chuyển XYZ',
    address: '202 Nguyễn Huệ, Quận 1, TP.HCM',
    phone: '0855666777',
    email: 'logistics@xyz.com',
    contact_person: 'Hoàng Văn E',
    status: Status.ACTIVE,
    supplier_type: SupplierType.SERVICE,
    tax_id: '3456789012',
    payment_terms: 'Net 15',
    notes: 'Dịch vụ vận chuyển hàng may mặc',
    website: 'http://vanchuyenxyz.com',
    created_at: '2023-05-20T00:00:00Z',
    updated_at: '2023-10-10T00:00:00Z'
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

// Mock data cho thanh toán hợp đồng
export const mockSupplierContractPayments: SupplierContractPayment[] = [
  {
    id: '1',
    contract_id: '1',
    payment_date: '2023-02-05T00:00:00Z',
    amount: 150000000,
    payment_method: PaymentMethod.BANK_TRANSFER,
    reference_no: 'CK-23020501',
    status: Status.COMPLETED,
    notes: 'Thanh toán đợt 1 - 30% giá trị hợp đồng',
    created_at: '2023-02-05T00:00:00Z',
    updated_at: '2023-02-05T00:00:00Z'
  },
  {
    id: '2',
    contract_id: '1',
    payment_date: '2023-03-10T00:00:00Z',
    amount: 350000000,
    payment_method: PaymentMethod.BANK_TRANSFER,
    reference_no: 'CK-23031001',
    status: Status.COMPLETED,
    notes: 'Thanh toán đợt 2 - 70% giá trị hợp đồng',
    created_at: '2023-03-10T00:00:00Z',
    updated_at: '2023-03-10T00:00:00Z'
  },
  {
    id: '3',
    contract_id: '2',
    payment_date: '2023-04-05T00:00:00Z',
    amount: 50000000,
    payment_method: PaymentMethod.BANK_TRANSFER,
    reference_no: 'CK-23040501',
    status: Status.COMPLETED,
    notes: 'Thanh toán đợt hàng tháng 4/2023',
    created_at: '2023-04-05T00:00:00Z',
    updated_at: '2023-04-05T00:00:00Z'
  },
  {
    id: '4',
    contract_id: '3',
    payment_date: '2023-07-01T00:00:00Z',
    amount: 10000000,
    payment_method: PaymentMethod.BANK_TRANSFER,
    reference_no: 'CK-23070101',
    status: Status.COMPLETED,
    notes: 'Thanh toán dịch vụ vận chuyển tháng 6/2023',
    created_at: '2023-07-01T00:00:00Z',
    updated_at: '2023-07-01T00:00:00Z'
  },
  {
    id: '5',
    contract_id: '4',
    payment_date: '2023-08-05T00:00:00Z',
    amount: 150000000,
    payment_method: PaymentMethod.BANK_TRANSFER,
    reference_no: 'CK-23080501',
    status: Status.COMPLETED,
    notes: 'Thanh toán đợt 1 - 50% giá trị hợp đồng',
    created_at: '2023-08-05T00:00:00Z',
    updated_at: '2023-08-05T00:00:00Z'
  }
];

// Mock data cho giao dịch
export const mockSupplierTransactions: SupplierTransaction[] = [
  {
    id: '1',
    supplier_id: '1',
    transaction_date: '2023-02-05T00:00:00Z',
    transaction_type: TransactionType.PAYMENT,
    amount: 150000000,
    description: 'Thanh toán đợt 1 hợp đồng HĐ-2023-001',
    document_no: 'TT-23020501',
    status: Status.COMPLETED,
    created_at: '2023-02-05T00:00:00Z',
    updated_at: '2023-02-05T00:00:00Z'
  },
  {
    id: '2',
    supplier_id: '1',
    transaction_date: '2023-03-10T00:00:00Z',
    transaction_type: TransactionType.PAYMENT,
    amount: 350000000,
    description: 'Thanh toán đợt 2 hợp đồng HĐ-2023-001',
    document_no: 'TT-23031001',
    status: Status.COMPLETED,
    created_at: '2023-03-10T00:00:00Z',
    updated_at: '2023-03-10T00:00:00Z'
  },
  {
    id: '3',
    supplier_id: '2',
    transaction_date: '2023-04-05T00:00:00Z',
    transaction_type: TransactionType.PAYMENT,
    amount: 50000000,
    description: 'Thanh toán phụ liệu tháng 4/2023',
    document_no: 'TT-23040501',
    status: Status.COMPLETED,
    created_at: '2023-04-05T00:00:00Z',
    updated_at: '2023-04-05T00:00:00Z'
  },
  {
    id: '4',
    supplier_id: '3',
    transaction_date: '2023-08-05T00:00:00Z',
    transaction_type: TransactionType.PAYMENT,
    amount: 150000000,
    description: 'Thanh toán đợt 1 hợp đồng HĐ-2023-004',
    document_no: 'TT-23080501',
    status: Status.COMPLETED,
    created_at: '2023-08-05T00:00:00Z',
    updated_at: '2023-08-05T00:00:00Z'
  },
  {
    id: '5',
    supplier_id: '5',
    transaction_date: '2023-07-01T00:00:00Z',
    transaction_type: TransactionType.PAYMENT,
    amount: 10000000,
    description: 'Thanh toán dịch vụ vận chuyển tháng 6/2023',
    document_no: 'TT-23070101',
    status: Status.COMPLETED,
    created_at: '2023-07-01T00:00:00Z',
    updated_at: '2023-07-01T00:00:00Z'
  },
  {
    id: '6',
    supplier_id: '1',
    transaction_date: '2023-03-15T00:00:00Z',
    transaction_type: TransactionType.REFUND,
    amount: 5000000,
    description: 'Hoàn trả tiền hàng lỗi',
    document_no: 'HT-23031501',
    status: Status.COMPLETED,
    created_at: '2023-03-15T00:00:00Z',
    updated_at: '2023-03-15T00:00:00Z'
  },
  {
    id: '7',
    supplier_id: '2',
    transaction_date: '2023-05-10T00:00:00Z',
    transaction_type: TransactionType.DEPOSIT,
    amount: 20000000,
    description: 'Đặt cọc đơn hàng phụ liệu đặc biệt',
    document_no: 'DC-23051001',
    status: Status.COMPLETED,
    created_at: '2023-05-10T00:00:00Z',
    updated_at: '2023-05-10T00:00:00Z'
  },
  {
    id: '8',
    supplier_id: '3',
    transaction_date: '2023-09-20T00:00:00Z',
    transaction_type: TransactionType.ADJUSTMENT,
    amount: -3000000,
    description: 'Điều chỉnh giảm do chất lượng không đạt',
    document_no: 'DC-23092001',
    status: Status.COMPLETED,
    created_at: '2023-09-20T00:00:00Z',
    updated_at: '2023-09-20T00:00:00Z'
  }
];

// Mock data cho đánh giá nhà cung cấp
export const mockSupplierRatings: SupplierRating[] = [
  {
    id: '1',
    supplier_id: '1',
    rating_date: '2023-06-30T00:00:00Z',
    quality_score: 4,
    delivery_score: 5,
    price_score: 3,
    service_score: 4,
    overall_score: 4,
    feedback: 'Vải chất lượng tốt, giao hàng đúng hẹn. Giá hơi cao so với thị trường.',
    rated_by: 'Nguyễn Thị Quản Lý',
    created_at: '2023-06-30T00:00:00Z',
    updated_at: '2023-06-30T00:00:00Z'
  },
  {
    id: '2',
    supplier_id: '2',
    rating_date: '2023-06-30T00:00:00Z',
    quality_score: 5,
    delivery_score: 4,
    price_score: 5,
    service_score: 3,
    overall_score: 4.25,
    feedback: 'Phụ liệu chất lượng cao, giá tốt. Dịch vụ khách hàng cần cải thiện.',
    rated_by: 'Nguyễn Thị Quản Lý',
    created_at: '2023-06-30T00:00:00Z',
    updated_at: '2023-06-30T00:00:00Z'
  },
  {
    id: '3',
    supplier_id: '3',
    rating_date: '2023-06-30T00:00:00Z',
    quality_score: 3,
    delivery_score: 3,
    price_score: 4,
    service_score: 4,
    overall_score: 3.5,
    feedback: 'Chỉ may chất lượng trung bình, giao hàng đôi khi trễ.',
    rated_by: 'Nguyễn Thị Quản Lý',
    created_at: '2023-06-30T00:00:00Z',
    updated_at: '2023-06-30T00:00:00Z'
  },
  {
    id: '4',
    supplier_id: '5',
    rating_date: '2023-06-30T00:00:00Z',
    quality_score: 5,
    delivery_score: 5,
    price_score: 3,
    service_score: 5,
    overall_score: 4.5,
    feedback: 'Dịch vụ vận chuyển xuất sắc, đáng tin cậy. Giá hơi cao.',
    rated_by: 'Nguyễn Thị Quản Lý',
    created_at: '2023-06-30T00:00:00Z',
    updated_at: '2023-06-30T00:00:00Z'
  },
  {
    id: '5',
    supplier_id: '1',
    rating_date: '2023-12-30T00:00:00Z',
    quality_score: 5,
    delivery_score: 5,
    price_score: 4,
    service_score: 5,
    overall_score: 4.75,
    feedback: 'Đã cải thiện rất nhiều so với đánh giá trước. Giá đã được điều chỉnh phù hợp hơn.',
    rated_by: 'Nguyễn Thị Quản Lý',
    created_at: '2023-12-30T00:00:00Z',
    updated_at: '2023-12-30T00:00:00Z'
  }
];

// Các hàm trợ giúp
export const getSupplierById = (id: string | number): Supplier | undefined => {
  return mockSuppliers.find(supplier => supplier.id.toString() === id.toString());
};

export const getContactsBySupplier = (supplierId: string | number): SupplierContact[] => {
  return mockSupplierContacts.filter(contact => contact.supplier_id.toString() === supplierId.toString());
};

export const getContractsBySupplier = (supplierId: string | number): SupplierContract[] => {
  return mockSupplierContracts.filter(contract => contract.supplier_id.toString() === supplierId.toString());
};

export const getPaymentsByContract = (contractId: string | number): SupplierContractPayment[] => {
  return mockSupplierContractPayments.filter(payment => payment.contract_id.toString() === contractId.toString());
};

export const getTransactionsBySupplier = (supplierId: string | number): SupplierTransaction[] => {
  return mockSupplierTransactions.filter(transaction => transaction.supplier_id.toString() === supplierId.toString());
};

export const getRatingsBySupplier = (supplierId: string | number): SupplierRating[] => {
  return mockSupplierRatings.filter(rating => rating.supplier_id.toString() === supplierId.toString());
};

export const getContractById = (id: string | number): SupplierContract | undefined => {
  return mockSupplierContracts.find(contract => contract.id.toString() === id.toString());
}; 