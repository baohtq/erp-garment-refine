import React, { useState } from 'react';
import { SupplierContact } from '@/db/types';
import { supabaseBrowserClient } from '@/utils/supabase/client';

interface SupplierContactFormProps {
  supplierId: string | number;
  contact?: Partial<SupplierContact>;
  onClose: () => void;
  onSuccess: () => void;
  isEditing?: boolean;
}

const SupplierContactForm: React.FC<SupplierContactFormProps> = ({
  supplierId,
  contact,
  onClose,
  onSuccess,
  isEditing = false
}) => {
  const [formData, setFormData] = useState<Partial<SupplierContact>>({
    supplier_id: supplierId,
    name: '',
    position: '',
    department: '',
    email: '',
    phone: '',
    is_primary: false,
    notes: '',
    ...contact
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: (e.target as HTMLInputElement).checked
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
      // Validate required fields
      if (!formData.name) {
        throw new Error('Tên liên hệ là bắt buộc');
      }

      if (isEditing && formData.id) {
        // Update existing contact
        const { error: updateError } = await supabaseBrowserClient
          .from('supplier_contacts')
          .update({
            name: formData.name,
            position: formData.position,
            department: formData.department,
            email: formData.email,
            phone: formData.phone,
            is_primary: formData.is_primary,
            notes: formData.notes,
            updated_at: new Date().toISOString()
          })
          .eq('id', formData.id);

        if (updateError) throw updateError;
      } else {
        // Create new contact
        const { error: insertError } = await supabaseBrowserClient
          .from('supplier_contacts')
          .insert({
            supplier_id: supplierId,
            name: formData.name,
            position: formData.position,
            department: formData.department,
            email: formData.email,
            phone: formData.phone,
            is_primary: formData.is_primary,
            notes: formData.notes
          });

        if (insertError) throw insertError;
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Error saving contact:', err);
      setError(err.message || 'An error occurred while saving the contact');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">{isEditing ? 'Cập nhật người liên hệ' : 'Thêm người liên hệ mới'}</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 border border-red-200 rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên người liên hệ <span className="text-red-500">*</span>
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
              Chức vụ
            </label>
            <input
              type="text"
              name="position"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={formData.position || ''}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phòng ban
            </label>
            <input
              type="text"
              name="department"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={formData.department || ''}
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
          
          <div className="flex items-center h-full pt-6">
            <input
              type="checkbox"
              id="is_primary"
              name="is_primary"
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              checked={formData.is_primary || false}
              onChange={handleChange}
            />
            <label htmlFor="is_primary" className="ml-2 block text-sm text-gray-700">
              Liên hệ chính
            </label>
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

export default SupplierContactForm; 