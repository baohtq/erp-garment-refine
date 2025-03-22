import React, { useState, useEffect } from 'react';

interface Fabric {
  id: number;
  code: string;
  name: string;
  description: string | null;
  width: number;
  weight: number;
  color: string;
  pattern: string;
  composition: string;
  supplier_id: number | null;
  unit: string;
  price: number;
  min_stock: number;
  status: string;
  created_at?: string;
  updated_at?: string;
}

interface FabricFormProps {
  fabric: Fabric | null;
  suppliers: { id: number; name: string }[];
  onSave: (fabric: Fabric) => void;
  onCancel: () => void;
}

const initialFabric: Fabric = {
  id: 0,
  code: '',
  name: '',
  description: '',
  width: 0,
  weight: 0,
  color: '',
  pattern: '',
  composition: '',
  supplier_id: null,
  unit: 'm',
  price: 0,
  min_stock: 0,
  status: 'active'
};

const FabricForm: React.FC<FabricFormProps> = ({ fabric, suppliers, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Fabric>(initialFabric);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (fabric) {
      setFormData(fabric);
    } else {
      setFormData(initialFabric);
    }
  }, [fabric]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.code.trim()) {
      newErrors.code = 'Mã vải không được để trống';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Tên vải không được để trống';
    }

    if (!formData.unit.trim()) {
      newErrors.unit = 'Đơn vị tính không được để trống';
    }

    if (formData.price < 0) {
      newErrors.price = 'Giá không được âm';
    }

    if (formData.min_stock < 0) {
      newErrors.min_stock = 'Tồn kho tối thiểu không được âm';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value ? parseFloat(value) : 0) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validate()) {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 z-10 overflow-y-auto bg-gray-500 bg-opacity-75">
      <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 w-full text-center sm:mt-0 sm:text-left">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  {fabric ? 'Sửa thông tin vải' : 'Thêm vải mới'}
                  <button
                    type="button"
                    className="absolute top-3 right-3 rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                    onClick={onCancel}
                  >
                    <span className="sr-only">Đóng</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </h3>
                
                <div className="mt-4">
                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-1">
                        <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                          Mã vải <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="code"
                          id="code"
                          value={formData.code}
                          onChange={handleChange}
                          className={`mt-1 block w-full rounded-md border ${errors.code ? 'border-red-300' : 'border-gray-300'} px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
                        />
                        {errors.code && <p className="mt-2 text-sm text-red-600">{errors.code}</p>}
                      </div>

                      <div className="col-span-1">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                          Tên vải <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          id="name"
                          value={formData.name}
                          onChange={handleChange}
                          className={`mt-1 block w-full rounded-md border ${errors.name ? 'border-red-300' : 'border-gray-300'} px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
                        />
                        {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name}</p>}
                      </div>

                      <div className="col-span-2">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                          Mô tả
                        </label>
                        <textarea
                          name="description"
                          id="description"
                          rows={3}
                          value={formData.description || ''}
                          onChange={handleChange}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>

                      <div className="col-span-1">
                        <label htmlFor="width" className="block text-sm font-medium text-gray-700">
                          Khổ vải (cm)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          name="width"
                          id="width"
                          value={formData.width || ''}
                          onChange={handleChange}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>

                      <div className="col-span-1">
                        <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
                          Định lượng (g/m²)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          name="weight"
                          id="weight"
                          value={formData.weight || ''}
                          onChange={handleChange}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>

                      <div className="col-span-1">
                        <label htmlFor="color" className="block text-sm font-medium text-gray-700">
                          Màu sắc
                        </label>
                        <input
                          type="text"
                          name="color"
                          id="color"
                          value={formData.color || ''}
                          onChange={handleChange}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>

                      <div className="col-span-1">
                        <label htmlFor="pattern" className="block text-sm font-medium text-gray-700">
                          Kiểu dáng/Họa tiết
                        </label>
                        <input
                          type="text"
                          name="pattern"
                          id="pattern"
                          value={formData.pattern || ''}
                          onChange={handleChange}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>

                      <div className="col-span-2">
                        <label htmlFor="composition" className="block text-sm font-medium text-gray-700">
                          Thành phần
                        </label>
                        <input
                          type="text"
                          name="composition"
                          id="composition"
                          value={formData.composition || ''}
                          onChange={handleChange}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                          placeholder="Ví dụ: 80% cotton, 20% polyester"
                        />
                      </div>

                      <div className="col-span-1">
                        <label htmlFor="supplier_id" className="block text-sm font-medium text-gray-700">
                          Nhà cung cấp
                        </label>
                        <select
                          name="supplier_id"
                          id="supplier_id"
                          value={formData.supplier_id || ''}
                          onChange={handleChange}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        >
                          <option value="">-- Chọn nhà cung cấp --</option>
                          {suppliers.map(supplier => (
                            <option key={supplier.id} value={supplier.id}>
                              {supplier.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="col-span-1">
                        <label htmlFor="unit" className="block text-sm font-medium text-gray-700">
                          Đơn vị tính <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="unit"
                          id="unit"
                          value={formData.unit}
                          onChange={handleChange}
                          className={`mt-1 block w-full rounded-md border ${errors.unit ? 'border-red-300' : 'border-gray-300'} px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
                        >
                          <option value="m">Mét (m)</option>
                          <option value="yard">Yard</option>
                          <option value="kg">Kilogram (kg)</option>
                        </select>
                        {errors.unit && <p className="mt-2 text-sm text-red-600">{errors.unit}</p>}
                      </div>

                      <div className="col-span-1">
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                          Giá
                        </label>
                        <input
                          type="number"
                          step="1000"
                          name="price"
                          id="price"
                          value={formData.price || ''}
                          onChange={handleChange}
                          className={`mt-1 block w-full rounded-md border ${errors.price ? 'border-red-300' : 'border-gray-300'} px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
                        />
                        {errors.price && <p className="mt-2 text-sm text-red-600">{errors.price}</p>}
                      </div>

                      <div className="col-span-1">
                        <label htmlFor="min_stock" className="block text-sm font-medium text-gray-700">
                          Tồn kho tối thiểu
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          name="min_stock"
                          id="min_stock"
                          value={formData.min_stock || ''}
                          onChange={handleChange}
                          className={`mt-1 block w-full rounded-md border ${errors.min_stock ? 'border-red-300' : 'border-gray-300'} px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
                        />
                        {errors.min_stock && <p className="mt-2 text-sm text-red-600">{errors.min_stock}</p>}
                      </div>

                      <div className="col-span-1">
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                          Trạng thái
                        </label>
                        <select
                          name="status"
                          id="status"
                          value={formData.status}
                          onChange={handleChange}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        >
                          <option value="active">Đang sử dụng</option>
                          <option value="inactive">Ngừng sử dụng</option>
                        </select>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              type="button"
              className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={handleSubmit}
            >
              {fabric ? 'Cập nhật' : 'Thêm mới'}
            </button>
            <button
              type="button"
              className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
              onClick={onCancel}
            >
              Hủy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FabricForm; 