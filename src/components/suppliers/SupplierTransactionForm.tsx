import React, { useState } from 'react';
import { SupplierTransaction } from '@db/types';
import { supabaseBrowserClient } from '@utils/supabase/client';

interface SupplierTransactionFormProps {
  supplierId: string | number;
  transaction?: Partial<SupplierTransaction>;
  onClose: () => void;
  onSuccess: () => void;
  isEditing?: boolean;
}

const SupplierTransactionForm: React.FC<SupplierTransactionFormProps> = ({
  supplierId, 
  transaction, 
  onClose, 
  onSuccess,
  isEditing = false
}) => {
  const [formData, setFormData] = useState<Partial<SupplierTransaction>>({
    supplier_id: supplierId,
    transaction_date: new Date().toISOString().split('T')[0],
    transaction_type: 'payment',
    amount: 0,
    description: '',
    document_no: '',
    status: 'completed',
    ...transaction
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Xử lý riêng cho trường amount để đảm bảo là số
    if (name === 'amount') {
      const numValue = parseFloat(value);
      setFormData({
        ...formData,
        [name]: isNaN(numValue) ? 0 : numValue
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      if (isEditing && formData.id) {
        // Cập nhật giao dịch
        const { error: updateError } = await supabaseBrowserClient
          .from('supplier_transactions')
          .update({
            transaction_date: formData.transaction_date,
            transaction_type: formData.transaction_type,
            amount: formData.amount,
            description: formData.description,
            document_no: formData.document_no,
            status: formData.status,
            updated_at: new Date().toISOString()
          })
          .eq('id', formData.id);

        if (updateError) throw updateError;
      } else {
        // Thêm giao dịch mới
        const { error: insertError } = await supabaseBrowserClient
          .from('supplier_transactions')
          .insert({
            supplier_id: supplierId,
            transaction_date: formData.transaction_date,
            transaction_type: formData.transaction_type,
            amount: formData.amount,
            description: formData.description,
            document_no: formData.document_no,
            status: formData.status
          });

        if (insertError) throw insertError;
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Lỗi khi lưu giao dịch:', err);
      setError(err.message || 'Đã xảy ra lỗi khi lưu giao dịch');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">{isEditing ? 'Cập nhật giao dịch' : 'Thêm giao dịch mới'}</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 border border-red-200 rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ngày giao dịch <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="transaction_date"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={formData.transaction_date ? formData.transaction_date.toString().split('T')[0] : ''}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Loại giao dịch <span className="text-red-500">*</span>
            </label>
            <select
              name="transaction_type"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={formData.transaction_type}
              onChange={handleChange}
              required
            >
              <option value="receipt">Nhập hàng</option>
              <option value="payment">Thanh toán</option>
              <option value="return">Trả hàng</option>
              <option value="other">Khác</option>
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Số tiền <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="amount"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={formData.amount}
              onChange={handleChange}
              min="0"
              step="1000"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Số chứng từ
            </label>
            <input
              type="text"
              name="document_no"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={formData.document_no || ''}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Trạng thái
          </label>
          <select
            name="status"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="completed">Hoàn thành</option>
            <option value="pending">Đang xử lý</option>
            <option value="cancelled">Đã hủy</option>
          </select>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mô tả
          </label>
          <textarea
            name="description"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            rows={3}
            value={formData.description || ''}
            onChange={handleChange}
          ></textarea>
        </div>
        
        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            disabled={isSubmitting}
          >
            Hủy
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Đang lưu...' : isEditing ? 'Cập nhật' : 'Thêm mới'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SupplierTransactionForm; 