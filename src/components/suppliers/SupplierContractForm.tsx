import React, { useState } from 'react';
import { SupplierContract } from '@db/types';
import { supabaseBrowserClient } from '@/utils/supabase/client';

interface SupplierContractFormProps {
  supplierId: string | number;
  contract?: Partial<SupplierContract>;
  onClose: () => void;
  onSuccess: () => void;
  isEditing?: boolean;
}

const SupplierContractForm: React.FC<SupplierContractFormProps> = ({
  supplierId,
  contract,
  onClose,
  onSuccess,
  isEditing = false
}) => {
  const [formData, setFormData] = useState<Partial<SupplierContract>>({
    supplier_id: supplierId,
    contract_no: '',
    contract_date: new Date().toISOString().split('T')[0],
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    contract_type: 'longterm',
    total_value: 0,
    payment_terms: '',
    delivery_terms: '',
    status: 'active',
    file_url: '',
    notes: '',
    ...contract
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Xử lý riêng cho trường số
    if (name === 'total_value') {
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsSubmitting(true);
    try {
      const file = files[0];
      const fileName = `contracts/${Date.now()}_${file.name}`;
      
      // Upload file to Supabase Storage
      const { error: uploadError, data } = await supabaseBrowserClient
        .storage
        .from('supplier-files')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: urlData } = supabaseBrowserClient
        .storage
        .from('supplier-files')
        .getPublicUrl(fileName);
      
      setFormData({
        ...formData,
        file_url: urlData.publicUrl
      });
    } catch (err: any) {
      console.error('Lỗi khi tải lên tệp:', err);
      setError(err.message || 'Đã xảy ra lỗi khi tải lên tệp');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Kiểm tra hợp lệ
    if (!formData.contract_no) {
      setError('Vui lòng nhập số hợp đồng');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      if (isEditing && formData.id) {
        // Cập nhật hợp đồng
        const { error: updateError } = await supabaseBrowserClient
          .from('supplier_contracts')
          .update({
            contract_no: formData.contract_no,
            contract_date: formData.contract_date,
            start_date: formData.start_date,
            end_date: formData.end_date,
            contract_type: formData.contract_type,
            total_value: formData.total_value,
            payment_terms: formData.payment_terms,
            delivery_terms: formData.delivery_terms,
            status: formData.status,
            file_url: formData.file_url,
            notes: formData.notes,
            updated_at: new Date().toISOString()
          })
          .eq('id', formData.id);

        if (updateError) throw updateError;
      } else {
        // Thêm hợp đồng mới
        const { error: insertError } = await supabaseBrowserClient
          .from('supplier_contracts')
          .insert({
            supplier_id: supplierId,
            contract_no: formData.contract_no,
            contract_date: formData.contract_date,
            start_date: formData.start_date,
            end_date: formData.end_date,
            contract_type: formData.contract_type,
            total_value: formData.total_value,
            payment_terms: formData.payment_terms,
            delivery_terms: formData.delivery_terms,
            status: formData.status,
            file_url: formData.file_url,
            notes: formData.notes
          });

        if (insertError) throw insertError;
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Lỗi khi lưu hợp đồng:', err);
      setError(err.message || 'Đã xảy ra lỗi khi lưu hợp đồng');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">{isEditing ? 'Cập nhật hợp đồng' : 'Thêm hợp đồng mới'}</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 border border-red-200 rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Số hợp đồng <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="contract_no"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={formData.contract_no || ''}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Loại hợp đồng
            </label>
            <select
              name="contract_type"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={formData.contract_type || 'longterm'}
              onChange={handleChange}
            >
              <option value="longterm">Dài hạn</option>
              <option value="project">Theo dự án</option>
              <option value="oneshot">Một lần</option>
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ngày ký hợp đồng <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="contract_date"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={formData.contract_date ? formData.contract_date.toString().split('T')[0] : ''}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ngày bắt đầu <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="start_date"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={formData.start_date ? formData.start_date.toString().split('T')[0] : ''}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ngày kết thúc
            </label>
            <input
              type="date"
              name="end_date"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={formData.end_date ? formData.end_date.toString().split('T')[0] : ''}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tổng giá trị hợp đồng
            </label>
            <input
              type="number"
              name="total_value"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={formData.total_value || ''}
              onChange={handleChange}
              min="0"
              step="1000"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trạng thái
            </label>
            <select
              name="status"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={formData.status || 'active'}
              onChange={handleChange}
            >
              <option value="draft">Bản nháp</option>
              <option value="active">Đang hiệu lực</option>
              <option value="expired">Hết hạn</option>
              <option value="terminated">Đã chấm dứt</option>
            </select>
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Điều khoản thanh toán
          </label>
          <textarea
            name="payment_terms"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            rows={2}
            value={formData.payment_terms || ''}
            onChange={handleChange}
          ></textarea>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Điều khoản giao hàng
          </label>
          <textarea
            name="delivery_terms"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            rows={2}
            value={formData.delivery_terms || ''}
            onChange={handleChange}
          ></textarea>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tệp đính kèm
          </label>
          <div className="flex items-center">
            <input
              type="file"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx"
            />
          </div>
          {formData.file_url && (
            <div className="mt-2 text-sm">
              <a 
                href={formData.file_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Xem tệp hiện tại
              </a>
            </div>
          )}
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

export default SupplierContractForm; 