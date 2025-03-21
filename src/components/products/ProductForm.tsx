import React, { useState } from 'react';
import { Product, Status, PRODUCT_CATEGORIES } from '@/types';
import { createClient } from '@supabase/supabase-js';
import Image from 'next/image';

interface ProductFormProps {
  product?: Partial<Product>;
  onSave: (product: Partial<Product>) => Promise<void>;
  onCancel: () => void;
}

// Use environment variables directly
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default function ProductForm({ product, onSave, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState<Partial<Product>>(product || {
    status: Status.ACTIVE,
    unit_price: 0,
    category: 'shirt'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(product?.image_url || null);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.code?.trim()) {
      newErrors.code = 'Mã sản phẩm là bắt buộc';
    }
    
    if (!formData.name?.trim()) {
      newErrors.name = 'Tên sản phẩm là bắt buộc';
    }
    
    if (!formData.category) {
      newErrors.category = 'Vui lòng chọn danh mục';
    }
    
    if (!formData.unit_price || formData.unit_price <= 0) {
      newErrors.unit_price = 'Giá sản phẩm phải lớn hơn 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'unit_price' ? Number(value) : value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, image: 'File phải là hình ảnh' }));
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, image: 'Kích thước file không được vượt quá 5MB' }));
      return;
    }

    setIsUploading(true);
    try {
      // Create a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `products/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(filePath);

      // Update form data and preview
      setFormData(prev => ({ ...prev, image_url: publicUrl }));
      setImagePreview(publicUrl);
      setErrors(prev => ({ ...prev, image: '' }));
    } catch (error) {
      console.error('Error uploading image:', error);
      setErrors(prev => ({ ...prev, image: 'Có lỗi xảy ra khi upload hình ảnh' }));
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    await onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Mã sản phẩm</label>
        <input
          type="text"
          name="code"
          value={formData.code || ''}
          onChange={handleInputChange}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
            errors.code ? 'border-red-500' : ''
          }`}
        />
        {errors.code && <p className="mt-1 text-sm text-red-600">{errors.code}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Tên sản phẩm</label>
        <input
          type="text"
          name="name"
          value={formData.name || ''}
          onChange={handleInputChange}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
            errors.name ? 'border-red-500' : ''
          }`}
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Mô tả</label>
        <textarea
          name="description"
          value={formData.description || ''}
          onChange={handleInputChange}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Danh mục</label>
        <select
          name="category"
          value={formData.category || ''}
          onChange={handleInputChange}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
            errors.category ? 'border-red-500' : ''
          }`}
        >
          <option value="">Chọn danh mục</option>
          {PRODUCT_CATEGORIES.map(category => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
        {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Giá</label>
        <input
          type="number"
          name="unit_price"
          value={formData.unit_price || ''}
          onChange={handleInputChange}
          min="0"
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
            errors.unit_price ? 'border-red-500' : ''
          }`}
        />
        {errors.unit_price && <p className="mt-1 text-sm text-red-600">{errors.unit_price}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Hình ảnh</label>
        <div className="mt-1 flex items-center space-x-4">
          {imagePreview && (
            <div className="relative w-40 h-40">
              <Image 
                src={imagePreview}
                alt="Product preview"
                className="object-cover rounded-md"
                width={160}
                height={160}
              />
              <button
                type="button"
                onClick={() => setImagePreview(null)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                aria-label="Remove image"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={isUploading}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
        </div>
        {errors.image && <p className="mt-1 text-sm text-red-600">{errors.image}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
        <select
          name="status"
          value={formData.status || Status.ACTIVE}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value={Status.ACTIVE}>Hoạt động</option>
          <option value={Status.INACTIVE}>Không hoạt động</option>
        </select>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Hủy
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Lưu
        </button>
      </div>
    </form>
  );
} 