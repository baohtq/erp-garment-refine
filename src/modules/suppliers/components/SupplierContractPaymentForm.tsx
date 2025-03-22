import React, { useState } from 'react';
import { SupplierContractPayment } from '@db/types';
import { supabaseBrowserClient } from '@utils/supabase/client';

interface SupplierContractPaymentFormProps {
  contractId: string | number;
  payment?: Partial<SupplierContractPayment>;
  onClose: () => void;
  onSuccess: () => void;
  isEditing?: boolean;
}

const SupplierContractPaymentForm: React.FC<SupplierContractPaymentFormProps> = ({
  contractId,
  payment,
  onClose,
  onSuccess,
  isEditing = false
}) => {
  const [formData, setFormData] = useState<Partial<SupplierContractPayment>>({
    contract_id: contractId,
    payment_date: new Date().toISOString().split('T')[0],
    amount: 0,
    payment_method: 'bank_transfer',
    reference_no: '',
    status: 'completed',
    notes: '',
    ...payment
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Xử lý riêng cho trường số
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
        // Cập nhật thanh toán
        const { error: updateError } = await supabaseBrowserClient
          .from('supplier_contract_payments')
          .update({
            payment_date: formData.payment_date,
            amount: formData.amount,
            payment_method: formData.payment_method,
            reference_no: formData.reference_no,
            status: formData.status,
            notes: formData.notes,
            updated_at: new Date().toISOString()
          })
          .eq('id', formData.id);

        if (updateError) throw updateError;
      } else {
        // Thêm thanh toán mới
        const { error: insertError } = await supabaseBrowserClient
          .from('supplier_contract_payments')
          .insert({
            contract_id: contractId,
            payment_date: formData.payment_date,
            amount: formData.amount,
            payment_method: formData.payment_method,
            reference_no: formData.reference_no,
            status: formData.status,
            notes: formData.notes
          });

        if (insertError) throw insertError;
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Lỗi khi lưu thanh toán:', err);
      setError(err.message || 'Đã xảy ra lỗi khi lưu thanh toán');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">{isEditing ? 'Cập nhật thanh toán' : 'Thêm thanh toán mới'}</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 border border-red-200 rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ngày thanh toán <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="payment_date"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={formData.payment_date ? formData.payment_date.toString().split('T')[0] : ''}
              onChange={handleChange}
              required
            />
          </div>
          
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
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phương thức thanh toán
            </label>
            <select
              name="payment_method"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={formData.payment_method || 'bank_transfer'}
              onChange={handleChange}
            >
              <option value="bank_transfer">Chuyển khoản</option>
              <option value="cash">Tiền mặt</option>
              <option value="credit">Công nợ</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Số tham chiếu
            </label>
            <input
              type="text"
              name="reference_no"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={formData.reference_no || ''}
              onChange={handleChange}
              placeholder="Số UNC/Phiếu chi/Số hóa đơn"
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
            value={formData.status || 'completed'}
            onChange={handleChange}
          >
            <option value="pending">Đang xử lý</option>
            <option value="completed">Đã thanh toán</option>
            <option value="cancelled">Đã hủy</option>
          </select>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ghi chú
          </label>
          <textarea
            name="notes"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            rows={3}
            value={formData.notes || ''}
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

export default SupplierContractPaymentForm; 