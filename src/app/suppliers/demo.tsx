import React, { useState } from 'react';
import { 
  SupplierForm, 
  SupplierContactForm, 
  SupplierContractForm,
  SupplierContractPaymentForm,
  SupplierTransactionForm,
  SupplierRatingForm
} from '@components/suppliers';

import {
  mockSuppliers,
  mockSupplierContacts,
  mockSupplierContracts,
  mockSupplierContractPayments,
  mockSupplierTransactions,
  mockSupplierRatings
} from '@mock/suppliers';

export default function SupplierFormDemo() {
  const [activeTab, setActiveTab] = useState<string>('supplier');
  // Sử dụng mockSuppliers[0] làm supplier hiện tại
  const [selectedSupplier] = useState(mockSuppliers[0]);
  // Sử dụng mockSupplierContracts[0] làm contract hiện tại
  const [selectedContract] = useState(mockSupplierContracts[0]);
  
  const handleSuccess = () => {
    alert('Lưu thành công!');
  };
  
  const renderPreviewData = () => {
    if (activeTab === 'supplier') {
      return (
        <div className="bg-yellow-50 p-4 rounded-lg mt-4 text-sm">
          <h3 className="text-sm font-semibold mb-2">Dữ liệu mẫu hiện tại:</h3>
          <pre className="overflow-auto max-h-60">
            {JSON.stringify(selectedSupplier, null, 2)}
          </pre>
        </div>
      );
    } else if (activeTab === 'contact') {
      return (
        <div className="bg-yellow-50 p-4 rounded-lg mt-4 text-sm">
          <h3 className="text-sm font-semibold mb-2">Danh sách người liên hệ mẫu:</h3>
          <pre className="overflow-auto max-h-60">
            {JSON.stringify(mockSupplierContacts.filter(contact => contact.supplier_id === selectedSupplier.id), null, 2)}
          </pre>
        </div>
      );
    } else if (activeTab === 'contract') {
      return (
        <div className="bg-yellow-50 p-4 rounded-lg mt-4 text-sm">
          <h3 className="text-sm font-semibold mb-2">Danh sách hợp đồng mẫu:</h3>
          <pre className="overflow-auto max-h-60">
            {JSON.stringify(mockSupplierContracts.filter(contract => contract.supplier_id === selectedSupplier.id), null, 2)}
          </pre>
        </div>
      );
    } else if (activeTab === 'payment') {
      return (
        <div className="bg-yellow-50 p-4 rounded-lg mt-4 text-sm">
          <h3 className="text-sm font-semibold mb-2">Danh sách thanh toán hợp đồng mẫu:</h3>
          <pre className="overflow-auto max-h-60">
            {JSON.stringify(mockSupplierContractPayments.filter(payment => payment.contract_id === selectedContract.id), null, 2)}
          </pre>
        </div>
      );
    } else if (activeTab === 'transaction') {
      return (
        <div className="bg-yellow-50 p-4 rounded-lg mt-4 text-sm">
          <h3 className="text-sm font-semibold mb-2">Danh sách giao dịch mẫu:</h3>
          <pre className="overflow-auto max-h-60">
            {JSON.stringify(mockSupplierTransactions.filter(transaction => transaction.supplier_id === selectedSupplier.id), null, 2)}
          </pre>
        </div>
      );
    } else if (activeTab === 'rating') {
      return (
        <div className="bg-yellow-50 p-4 rounded-lg mt-4 text-sm">
          <h3 className="text-sm font-semibold mb-2">Danh sách đánh giá mẫu:</h3>
          <pre className="overflow-auto max-h-60">
            {JSON.stringify(mockSupplierRatings.filter(rating => rating.supplier_id === selectedSupplier.id), null, 2)}
          </pre>
        </div>
      );
    }
    
    return null;
  };
  
  const renderActiveForm = () => {
    switch(activeTab) {
      case 'supplier':
        return (
          <SupplierForm
            supplier={selectedSupplier}
            onClose={() => console.log('Close form')}
            onSuccess={(id) => {
              console.log('Supplier saved with ID:', id);
              handleSuccess();
            }}
            isEditing={true}
          />
        );
      case 'contact':
        const contact = mockSupplierContacts.find(c => c.supplier_id === selectedSupplier.id);
        return (
          <SupplierContactForm
            supplierId={selectedSupplier.id}
            contact={contact}
            onClose={() => console.log('Close form')}
            onSuccess={handleSuccess}
            isEditing={!!contact}
          />
        );
      case 'contract':
        const contract = mockSupplierContracts.find(c => c.supplier_id === selectedSupplier.id);
        return (
          <SupplierContractForm
            supplierId={selectedSupplier.id}
            contract={contract}
            onClose={() => console.log('Close form')}
            onSuccess={handleSuccess}
            isEditing={!!contract}
          />
        );
      case 'payment':
        const payment = mockSupplierContractPayments.find(p => p.contract_id === selectedContract.id);
        return (
          <SupplierContractPaymentForm
            contractId={selectedContract.id}
            payment={payment}
            onClose={() => console.log('Close form')}
            onSuccess={handleSuccess}
            isEditing={!!payment}
          />
        );
      case 'transaction':
        const transaction = mockSupplierTransactions.find(t => t.supplier_id === selectedSupplier.id);
        return (
          <SupplierTransactionForm
            supplierId={selectedSupplier.id}
            transaction={transaction}
            onClose={() => console.log('Close form')}
            onSuccess={handleSuccess}
            isEditing={!!transaction}
          />
        );
      case 'rating':
        const rating = mockSupplierRatings.find(r => r.supplier_id === selectedSupplier.id);
        return (
          <SupplierRatingForm
            supplierId={selectedSupplier.id}
            rating={rating}
            onClose={() => console.log('Close form')}
            onSuccess={handleSuccess}
            isEditing={!!rating}
          />
        );
      default:
        return <div>Chọn loại biểu mẫu để hiển thị</div>;
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">Demo Form Nhà Cung Cấp</h1>
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
        <strong className="font-bold">Chú ý!</strong>
        <span className="block sm:inline"> Đây là trang demo. Các thay đổi sẽ không được lưu lại.</span>
        <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
          <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <title>Close</title>
            <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
          </svg>
        </span>
      </div>
      <p className="text-gray-600 mb-6">
        Các form dưới đây được hiển thị với dữ liệu mẫu. Nhấn "Thêm mới" hoặc "Cập nhật" để test.
        Dữ liệu sẽ không thực sự được lưu vào cơ sở dữ liệu.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="mb-6">
            <div className="flex space-x-2 mb-4 border-b overflow-x-auto">
              {['supplier', 'contact', 'contract', 'payment', 'transaction', 'rating'].map((tab) => (
                <button
                  key={tab}
                  className={`px-4 py-2 font-medium ${activeTab === tab ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-blue-500'}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === 'supplier' && 'Nhà cung cấp'}
                  {tab === 'contact' && 'Người liên hệ'}
                  {tab === 'contract' && 'Hợp đồng'}
                  {tab === 'payment' && 'Thanh toán hợp đồng'}
                  {tab === 'transaction' && 'Giao dịch'}
                  {tab === 'rating' && 'Đánh giá'}
                </button>
              ))}
            </div>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            {renderActiveForm()}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Thông tin hiện tại</h2>
          <div className="mb-4">
            <div className="text-sm text-gray-600 mb-2">
              <span className="font-medium">Nhà cung cấp hiện tại:</span> {selectedSupplier.name} (ID: {selectedSupplier.id})
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">Hợp đồng hiện tại:</span> {selectedContract.contract_no} (ID: {selectedContract.id})
            </div>
          </div>
          
          {renderPreviewData()}
        </div>
      </div>
      <p className="text-sm text-gray-500">Tính năng &quot;Nhập từ Excel&quot; cho phép bạn nhập danh sách nhà cung cấp từ file Excel.</p>
    </div>
  );
} 