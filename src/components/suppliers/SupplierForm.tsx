import React, { useState } from 'react';
import { Supplier } from '@/db/types';
import { supabaseBrowserClient } from '@/utils/supabase/client';

interface SupplierFormProps {
  supplier?: Partial<Supplier>;
  onClose: () => void;
  onSuccess: (supplierId: string) => void;
  isEditing?: boolean;
}

const SupplierForm: React.FC<SupplierFormProps> = ({
  supplier,
  onClose,
  onSuccess,
  isEditing = false
}) => {
  const [formData, setFormData] = useState<Partial<Supplier>>({
    name: '',
    code: '',
    contact_person: '',
    email: '',
    phone: '',
    address: '',
    tax_id: '',
    payment_terms: '',
    supplier_type: 'material',
    status: 'active',
    notes: '',
    website: '',
    ...supplier
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Validate required fields
      if (!formData.name) {
        throw new Error('Tên nhà cung cấp là bắt buộc');
      }

      if (isEditing && formData.id) {
        // Update existing supplier
        const { error: updateError } = await supabaseBrowserClient
          .from('suppliers')
          .update({
            name: formData.name,
            code: formData.code,
            contact_person: formData.contact_person,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            tax_id: formData.tax_id,
            payment_terms: formData.payment_terms,
            supplier_type: formData.supplier_type,
            status: formData.status,
            notes: formData.notes,
            website: formData.website,
            updated_at: new Date().toISOString()
          })
          .eq('id', formData.id);

        if (updateError) throw updateError;
        
        onSuccess(formData.id.toString());
      } else {
        // Create new supplier
        const { data: newSupplier, error: insertError } = await supabaseBrowserClient
          .from('suppliers')
          .insert({
            name: formData.name,
            code: formData.code,
            contact_person: formData.contact_person,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            tax_id: formData.tax_id,
            payment_terms: formData.payment_terms,
            supplier_type: formData.supplier_type,
            status: formData.status,
            notes: formData.notes,
            website: formData.website
          })
          .select('id')
          .single();

        if (insertError) throw insertError;
        
        if (newSupplier) {
          onSuccess(newSupplier.id.toString());
        }
      }

      onClose();
    } catch (err: any) {
      console.error('Error saving supplier:', err);
      setError(err.message || 'An error occurred while saving the supplier');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">{isEditing ? 'Cập nhật nhà cung cấp' : 'Thêm nhà cung cấp mới'}</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 border border-red-200 rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên nhà cung cấp <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={formData.name || ''}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mã nhà cung cấp
            </label>
            <input
              type="text"
              name="code"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={formData.code || ''}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Loại nhà cung cấp
            </label>
            <select
              name="supplier_type"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={formData.supplier_type || 'material'}
              onChange={handleChange}
            >
              <option value="material">Nguyên vật liệu</option>
              <option value="accessory">Phụ liệu</option>
              <option value="fabric">Vải</option>
              <option value="service">Dịch vụ</option>
              <option value="other">Khác</option>
            </select>
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
              <option value="active">Đang hoạt động</option>
              <option value="inactive">Không hoạt động</option>
              <option value="pending">Chờ xét duyệt</option>
              <option value="blacklisted">Danh sách đen</option>
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Người liên hệ
            </label>
            <input
              type="text"
              name="contact_person"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={formData.contact_person || ''}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={formData.email || ''}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Số điện thoại
            </label>
            <input
              type="tel"
              name="phone"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={formData.phone || ''}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Website
            </label>
            <input
              type="url"
              name="website"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={formData.website || ''}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Địa chỉ
          </label>
          <input
            type="text"
            name="address"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            value={formData.address || ''}
            onChange={handleChange}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mã số thuế
            </label>
            <input
              type="text"
              name="tax_id"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={formData.tax_id || ''}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Điều khoản thanh toán
            </label>
            <input
              type="text"
              name="payment_terms"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={formData.payment_terms || ''}
              onChange={handleChange}
              placeholder="Ví dụ: Net 30, COD, v.v."
            />
          </div>
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

export default SupplierForm; 