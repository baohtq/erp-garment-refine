import React, { useState } from 'react';
import { SupplierRating } from '@db/types';
import { supabaseBrowserClient } from '@/utils/supabase/client';

interface SupplierRatingFormProps {
  supplierId: string | number;
  rating?: Partial<SupplierRating>;
  onClose: () => void;
  onSuccess: () => void;
  isEditing?: boolean;
}

const SupplierRatingForm: React.FC<SupplierRatingFormProps> = ({
  supplierId,
  rating,
  onClose,
  onSuccess,
  isEditing = false
}) => {
  const [formData, setFormData] = useState<Partial<SupplierRating>>({
    supplier_id: supplierId,
    rating_date: new Date().toISOString().split('T')[0],
    quality_score: rating?.quality_score || 3,
    delivery_score: rating?.delivery_score || 3,
    price_score: rating?.price_score || 3,
    service_score: rating?.service_score || 3,
    overall_score: rating?.overall_score || 3,
    feedback: rating?.feedback || '',
    rated_by: rating?.rated_by || '',
    ...rating
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Xử lý cho trường số điểm
    if (['quality_score', 'delivery_score', 'price_score', 'service_score'].includes(name)) {
      const numValue = parseInt(value);
      setFormData(prev => {
        const newData = {
          ...prev,
          [name]: isNaN(numValue) ? 1 : Math.min(Math.max(numValue, 1), 5)
        };
        
        // Tính điểm trung bình
        const overallScore = (
          (newData.quality_score || 0) + 
          (newData.delivery_score || 0) + 
          (newData.price_score || 0) + 
          (newData.service_score || 0)
        ) / 4;
        
        return {
          ...newData,
          overall_score: parseFloat(overallScore.toFixed(1))
        };
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
        // Cập nhật đánh giá
        const { error: updateError } = await supabaseBrowserClient
          .from('supplier_ratings')
          .update({
            rating_date: formData.rating_date,
            quality_score: formData.quality_score,
            delivery_score: formData.delivery_score,
            price_score: formData.price_score,
            service_score: formData.service_score,
            overall_score: formData.overall_score,
            feedback: formData.feedback,
            rated_by: formData.rated_by,
            updated_at: new Date().toISOString()
          })
          .eq('id', formData.id);

        if (updateError) throw updateError;
      } else {
        // Thêm đánh giá mới
        const { error: insertError } = await supabaseBrowserClient
          .from('supplier_ratings')
          .insert({
            supplier_id: supplierId,
            rating_date: formData.rating_date,
            quality_score: formData.quality_score,
            delivery_score: formData.delivery_score,
            price_score: formData.price_score,
            service_score: formData.service_score,
            overall_score: formData.overall_score,
            feedback: formData.feedback,
            rated_by: formData.rated_by
          });

        if (insertError) throw insertError;
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Lỗi khi lưu đánh giá:', err);
      setError(err.message || 'Đã xảy ra lỗi khi lưu đánh giá');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderScoreSelector = (
    label: string, 
    name: 'quality_score' | 'delivery_score' | 'price_score' | 'service_score',
    description: string
  ) => {
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} <span className="text-red-500">*</span>
          <span className="ml-2 text-xs text-gray-500">({description})</span>
        </label>
        <div className="flex items-center space-x-4">
          {[1, 2, 3, 4, 5].map((score) => (
            <label key={score} className="flex items-center space-x-1 cursor-pointer">
              <input
                type="radio"
                name={name}
                value={score}
                checked={formData[name] === score}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span>{score}</span>
              {score === 1 && <span className="text-xs text-gray-500">(Kém)</span>}
              {score === 5 && <span className="text-xs text-gray-500">(Tốt)</span>}
            </label>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">{isEditing ? 'Cập nhật đánh giá' : 'Thêm đánh giá mới'}</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 border border-red-200 rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ngày đánh giá <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="rating_date"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={formData.rating_date ? formData.rating_date.toString().split('T')[0] : ''}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Người đánh giá
            </label>
            <input
              type="text"
              name="rated_by"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={formData.rated_by || ''}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-md mb-6">
          <h3 className="font-medium text-lg mb-3">Thang điểm đánh giá (1-5)</h3>

          {renderScoreSelector(
            'Chất lượng', 
            'quality_score', 
            'Chất lượng hàng hóa, độ đồng đều, tỷ lệ lỗi'
          )}
          
          {renderScoreSelector(
            'Giao hàng', 
            'delivery_score', 
            'Đúng hẹn, đầy đủ số lượng, nhanh chóng'
          )}
          
          {renderScoreSelector(
            'Giá cả', 
            'price_score', 
            'Mức giá hợp lý, ổn định, chính sách khuyến mãi'
          )}
          
          {renderScoreSelector(
            'Dịch vụ', 
            'service_score', 
            'Thái độ phục vụ, hỗ trợ kỹ thuật, giải quyết khiếu nại'
          )}
          
          <div className="mt-4 flex items-center">
            <span className="font-medium mr-3">Điểm trung bình:</span>
            <span className="text-xl font-bold text-yellow-600">{formData.overall_score}/5</span>
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nhận xét
          </label>
          <textarea
            name="feedback"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            rows={4}
            value={formData.feedback || ''}
            onChange={handleChange}
            placeholder="Nhập nhận xét về nhà cung cấp..."
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

export default SupplierRatingForm; 