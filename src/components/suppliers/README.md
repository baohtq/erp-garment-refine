# Supplier Components

Các component quản lý nhà cung cấp trong hệ thống ERP Garment.

## Danh sách component

1. **SupplierForm**: Form quản lý thông tin nhà cung cấp
2. **SupplierContactForm**: Form quản lý người liên hệ của nhà cung cấp
3. **SupplierContractForm**: Form quản lý hợp đồng với nhà cung cấp
4. **SupplierContractPaymentForm**: Form quản lý thanh toán hợp đồng
5. **SupplierTransactionForm**: Form quản lý giao dịch với nhà cung cấp
6. **SupplierRatingForm**: Form đánh giá nhà cung cấp

## Cách sử dụng

### Import

```tsx
import { 
  SupplierForm, 
  SupplierContactForm, 
  SupplierContractForm,
  SupplierContractPaymentForm, 
  SupplierTransactionForm,
  SupplierRatingForm 
} from '@components/suppliers';
```

### SupplierForm

```tsx
<SupplierForm
  supplier={existingSupplier} // Optional, dùng khi cập nhật
  onClose={() => setIsModalOpen(false)}
  onSuccess={(supplierId) => {
    fetchSuppliers();
    showNotification('Đã lưu nhà cung cấp thành công');
  }}
  isEditing={true} // Optional, mặc định là false
/>
```

### SupplierContactForm

```tsx
<SupplierContactForm
  supplierId={supplierId}
  contact={existingContact} // Optional, dùng khi cập nhật
  onClose={() => setIsContactModalOpen(false)}
  onSuccess={() => {
    fetchContacts();
    showNotification('Đã lưu người liên hệ thành công');
  }}
  isEditing={true} // Optional, mặc định là false
/>
```

### SupplierContractForm

```tsx
<SupplierContractForm
  supplierId={supplierId}
  contract={existingContract} // Optional, dùng khi cập nhật
  onClose={() => setIsContractModalOpen(false)}
  onSuccess={() => {
    fetchContracts();
    showNotification('Đã lưu hợp đồng thành công');
  }}
  isEditing={true} // Optional, mặc định là false
/>
```

### SupplierContractPaymentForm

```tsx
<SupplierContractPaymentForm
  contractId={contractId}
  payment={existingPayment} // Optional, dùng khi cập nhật
  onClose={() => setIsPaymentModalOpen(false)}
  onSuccess={() => {
    fetchPayments();
    showNotification('Đã lưu thanh toán thành công');
  }}
  isEditing={true} // Optional, mặc định là false
/>
```

### SupplierTransactionForm

```tsx
<SupplierTransactionForm
  supplierId={supplierId}
  transaction={existingTransaction} // Optional, dùng khi cập nhật
  onClose={() => setIsTransactionModalOpen(false)}
  onSuccess={() => {
    fetchTransactions();
    showNotification('Đã lưu giao dịch thành công');
  }}
  isEditing={true} // Optional, mặc định là false
/>
```

### SupplierRatingForm

```tsx
<SupplierRatingForm
  supplierId={supplierId}
  rating={existingRating} // Optional, dùng khi cập nhật
  onClose={() => setIsRatingModalOpen(false)}
  onSuccess={() => {
    fetchRatings();
    showNotification('Đã lưu đánh giá thành công');
  }}
  isEditing={true} // Optional, mặc định là false
/>
```

## Props

### SupplierForm Props

| Prop | Type | Mô tả |
|------|------|-------|
| supplier | Partial\<Supplier\> | Dữ liệu nhà cung cấp hiện có (nếu là cập nhật) |
| onClose | () => void | Hàm callback khi đóng form |
| onSuccess | (supplierId: string) => void | Hàm callback khi lưu thành công |
| isEditing | boolean | Flag đánh dấu là đang cập nhật (true) hay thêm mới (false) |

### SupplierContactForm Props

| Prop | Type | Mô tả |
|------|------|-------|
| supplierId | string \| number | ID của nhà cung cấp |
| contact | Partial\<SupplierContact\> | Dữ liệu người liên hệ hiện có (nếu là cập nhật) |
| onClose | () => void | Hàm callback khi đóng form |
| onSuccess | () => void | Hàm callback khi lưu thành công |
| isEditing | boolean | Flag đánh dấu là đang cập nhật (true) hay thêm mới (false) |

### SupplierContractForm Props

| Prop | Type | Mô tả |
|------|------|-------|
| supplierId | string \| number | ID của nhà cung cấp |
| contract | Partial\<SupplierContract\> | Dữ liệu hợp đồng hiện có (nếu là cập nhật) |
| onClose | () => void | Hàm callback khi đóng form |
| onSuccess | () => void | Hàm callback khi lưu thành công |
| isEditing | boolean | Flag đánh dấu là đang cập nhật (true) hay thêm mới (false) |

### SupplierContractPaymentForm Props

| Prop | Type | Mô tả |
|------|------|-------|
| contractId | string \| number | ID của hợp đồng |
| payment | Partial\<SupplierContractPayment\> | Dữ liệu thanh toán hiện có (nếu là cập nhật) |
| onClose | () => void | Hàm callback khi đóng form |
| onSuccess | () => void | Hàm callback khi lưu thành công |
| isEditing | boolean | Flag đánh dấu là đang cập nhật (true) hay thêm mới (false) |

### SupplierTransactionForm Props

| Prop | Type | Mô tả |
|------|------|-------|
| supplierId | string \| number | ID của nhà cung cấp |
| transaction | Partial\<SupplierTransaction\> | Dữ liệu giao dịch hiện có (nếu là cập nhật) |
| onClose | () => void | Hàm callback khi đóng form |
| onSuccess | () => void | Hàm callback khi lưu thành công |
| isEditing | boolean | Flag đánh dấu là đang cập nhật (true) hay thêm mới (false) |

### SupplierRatingForm Props

| Prop | Type | Mô tả |
|------|------|-------|
| supplierId | string \| number | ID của nhà cung cấp |
| rating | Partial\<SupplierRating\> | Dữ liệu đánh giá hiện có (nếu là cập nhật) |
| onClose | () => void | Hàm callback khi đóng form |
| onSuccess | () => void | Hàm callback khi lưu thành công |
| isEditing | boolean | Flag đánh dấu là đang cập nhật (true) hay thêm mới (false) | 