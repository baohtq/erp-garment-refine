import React, { useState } from 'react';

interface FabricInventory {
  id?: number;
  fabric_id: number;
  lot_number: string;
  supplier_code: string;
  roll_id: string;
  length: number;
  width: number;
  weight: number;
  defect_notes: string | null;
  quality_grade: string;
  location: string;
  status: string;
  color_code: string;
  image_url: string;
  created_at?: string;
  updated_at?: string;
}

interface Fabric {
  id: number;
  code: string;
  name: string;
}

interface InventoryFormProps {
  fabrics: Fabric[];
  onSave: (inventory: FabricInventory) => void;
  onCancel: () => void;
}

const InventoryForm: React.FC<InventoryFormProps> = ({ fabrics, onSave, onCancel }) => {
  const [bulkMode, setBulkMode] = useState<boolean>(false);
  const [rollCount, setRollCount] = useState<number>(1);
  const [supplierCodePrefix, setSupplierCodePrefix] = useState<string>('');
  
  const [formState, setFormState] = useState<FabricInventory>({
    fabric_id: fabrics.length > 0 ? fabrics[0].id : 0,
    lot_number: '',
    supplier_code: '',
    roll_id: '',
    length: 0,
    width: 0,
    weight: 0,
    defect_notes: null,
    quality_grade: 'A',
    location: '',
    status: 'available',
    color_code: '#000000',
    image_url: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (['length', 'width', 'weight'].includes(name)) {
      setFormState({
        ...formState,
        [name]: value === '' ? 0 : parseFloat(value)
      });
    } else {
      setFormState({
        ...formState,
        [name]: value
      });
    }
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formState.fabric_id) {
      newErrors.fabric_id = 'Vui lòng chọn loại vải';
    }
    
    if (!formState.lot_number) {
      newErrors.lot_number = 'Vui lòng nhập số lô';
    }
    
    if (!bulkMode && !formState.supplier_code) {
      newErrors.supplier_code = 'Vui lòng nhập mã sản xuất từ nhà cung cấp';
    }
    
    if (bulkMode && !supplierCodePrefix) {
      newErrors.supplierCodePrefix = 'Vui lòng nhập tiền tố mã sản xuất';
    }
    
    if (formState.weight <= 0) {
      newErrors.weight = 'Trọng lượng phải lớn hơn 0';
    }
    
    if (!formState.quality_grade) {
      newErrors.quality_grade = 'Vui lòng chọn cấp chất lượng';
    }
    
    if (!formState.location) {
      newErrors.location = 'Vui lòng nhập vị trí lưu kho';
    }
    
    if (!formState.status) {
      newErrors.status = 'Vui lòng chọn trạng thái';
    }
    
    if (!formState.color_code) {
      newErrors.color_code = 'Vui lòng chọn mã màu sắc';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (bulkMode) {
      for (let i = 1; i <= rollCount; i++) {
        const paddedIndex = i.toString().padStart(3, '0');
        const supplierCode = `${supplierCodePrefix}${paddedIndex}`;
        // Cũng tạo mã roll_id tự động từ mã supplier_code
        const rollId = `R-${supplierCode}`;
        
        const inventoryItem: FabricInventory = {
          ...formState,
          supplier_code: supplierCode,
          roll_id: rollId
        };
        
        onSave(inventoryItem);
      }
    } else {
      // Tự động tạo mã roll_id từ supplier_code nếu trống
      const updatedFormState = {
        ...formState,
        roll_id: formState.roll_id || `R-${formState.supplier_code}`
      };
      onSave(updatedFormState);
    }
    
    onCancel();
  };
  
  return (
    <div className="fixed inset-0 z-10 overflow-y-auto bg-gray-500 bg-opacity-75">
      <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 w-full text-center sm:mt-0 sm:text-left">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Nhập kho vải
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
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">Chế độ nhập:</label>
                      <div className="mt-2 flex items-center space-x-4">
                        <div className="flex items-center">
                          <input
                            type="radio"
                            name="input_mode"
                            id="single_mode"
                            checked={!bulkMode}
                            onChange={() => setBulkMode(false)}
                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <label htmlFor="single_mode" className="ml-2 block text-sm text-gray-700">
                            Nhập đơn lẻ
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="radio"
                            name="input_mode"
                            id="bulk_mode"
                            checked={bulkMode}
                            onChange={() => setBulkMode(true)}
                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <label htmlFor="bulk_mode" className="ml-2 block text-sm text-gray-700">
                            Nhập hàng loạt
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    {/* Phần thông tin chính - sẽ được nhấn mạnh */}
                    <div className="mb-6 rounded-md bg-blue-50 p-4">
                      <div className="font-medium text-blue-800 mb-2">Thông tin cơ bản</div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                          <label htmlFor="fabric_id" className="block text-sm font-medium text-gray-700">
                            Loại vải <span className="text-red-500">*</span>
                          </label>
                          <select
                            id="fabric_id"
                            name="fabric_id"
                            value={formState.fabric_id}
                            onChange={handleChange}
                            className={`mt-1 block w-full rounded-md border ${errors.fabric_id ? 'border-red-300' : 'border-gray-300'} px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
                          >
                            {fabrics.map((fabric) => (
                              <option key={fabric.id} value={fabric.id}>
                                {fabric.code} - {fabric.name}
                              </option>
                            ))}
                          </select>
                          {errors.fabric_id && (
                            <p className="mt-2 text-sm text-red-600">{errors.fabric_id}</p>
                          )}
                        </div>

                        <div className="col-span-2">
                          <label htmlFor="lot_number" className="block text-sm font-medium text-gray-700">
                            Số lô <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="lot_number"
                            id="lot_number"
                            value={formState.lot_number}
                            onChange={handleChange}
                            className={`mt-1 block w-full rounded-md border ${errors.lot_number ? 'border-red-300' : 'border-gray-300'} px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
                          />
                          {errors.lot_number && (
                            <p className="mt-2 text-sm text-red-600">{errors.lot_number}</p>
                          )}
                        </div>
                        
                        {!bulkMode ? (
                          <div className="col-span-2">
                            <label htmlFor="supplier_code" className="block text-sm font-medium text-gray-700">
                              Mã sản xuất nhà cung cấp <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="supplier_code"
                              id="supplier_code"
                              value={formState.supplier_code}
                              onChange={handleChange}
                              className={`mt-1 block w-full rounded-md border ${errors.supplier_code ? 'border-red-300' : 'border-gray-300'} px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
                              placeholder="Nhập mã sản xuất từ nhà cung cấp"
                            />
                            {errors.supplier_code && (
                              <p className="mt-2 text-sm text-red-600">{errors.supplier_code}</p>
                            )}
                          </div>
                        ) : (
                          <div className="col-span-2 grid grid-cols-2 gap-4">
                            <div>
                              <label htmlFor="supplierCodePrefix" className="block text-sm font-medium text-gray-700">
                                Tiền tố mã sản xuất <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                name="supplierCodePrefix"
                                id="supplierCodePrefix"
                                value={supplierCodePrefix}
                                onChange={(e) => setSupplierCodePrefix(e.target.value)}
                                placeholder="VD: KK-23A-"
                                className={`mt-1 block w-full rounded-md border ${errors.supplierCodePrefix ? 'border-red-300' : 'border-gray-300'} px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
                              />
                              {errors.supplierCodePrefix && (
                                <p className="mt-2 text-sm text-red-600">{errors.supplierCodePrefix}</p>
                              )}
                            </div>
                            <div>
                              <label htmlFor="rollCount" className="block text-sm font-medium text-gray-700">
                                Số lượng cây vải <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="number"
                                name="rollCount"
                                id="rollCount"
                                min="1"
                                value={rollCount}
                                onChange={(e) => setRollCount(parseInt(e.target.value) || 1)}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                              />
                            </div>
                            <div className="col-span-2">
                              <p className="text-xs text-gray-500 italic">
                                Ví dụ mã sản xuất: {supplierCodePrefix}001, {supplierCodePrefix}002, ... {supplierCodePrefix}{rollCount.toString().padStart(3, '0')}
                              </p>
                            </div>
                          </div>
                        )}
                        
                        <div className="col-span-2">
                          <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
                            Trọng lượng (kg) <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            name="weight"
                            id="weight"
                            value={formState.weight || ''}
                            onChange={handleChange}
                            className={`mt-1 block w-full rounded-md border ${errors.weight ? 'border-red-300' : 'border-gray-300'} px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
                          />
                          {errors.weight && (
                            <p className="mt-2 text-sm text-red-600">{errors.weight}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Phần thông tin phụ - có thể mở rộng/thu gọn */}
                    <details className="mb-4">
                      <summary className="cursor-pointer font-medium text-gray-700">Thông tin bổ sung</summary>
                      <div className="mt-4 grid grid-cols-2 gap-4 pl-4">
                        <div>
                          <label htmlFor="color_code" className="block text-sm font-medium text-gray-700">
                            Mã màu sắc <span className="text-red-500">*</span>
                          </label>
                          <div className="mt-1 flex items-center">
                            <input
                              type="color"
                              name="color_code"
                              id="color_code"
                              value={formState.color_code}
                              onChange={handleChange}
                              className="h-8 w-8 rounded-md border border-gray-300 p-0"
                            />
                            <input
                              type="text"
                              name="color_code"
                              value={formState.color_code}
                              onChange={handleChange}
                              className="ml-2 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                              placeholder="#000000"
                            />
                          </div>
                          {errors.color_code && (
                            <p className="mt-2 text-sm text-red-600">{errors.color_code}</p>
                          )}
                        </div>
                        
                        <div>
                          <label htmlFor="image_url" className="block text-sm font-medium text-gray-700">
                            URL hình ảnh
                          </label>
                          <input
                            type="text"
                            name="image_url"
                            id="image_url"
                            value={formState.image_url}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            placeholder="https://example.com/image.jpg"
                          />
                          {formState.image_url && (
                            <div className="mt-2 h-16 w-16 overflow-hidden rounded-md border border-gray-300">
                              <img 
                                src={formState.image_url} 
                                alt="Xem trước hình ảnh vải" 
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = "https://via.placeholder.com/150?text=Invalid+URL";
                                }}
                              />
                            </div>
                          )}
                        </div>
                        
                        <div>
                          <label htmlFor="length" className="block text-sm font-medium text-gray-700">
                            Chiều dài (m)
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            name="length"
                            id="length"
                            value={formState.length || ''}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="width" className="block text-sm font-medium text-gray-700">
                            Chiều rộng (cm)
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            name="width"
                            id="width"
                            value={formState.width || ''}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="quality_grade" className="block text-sm font-medium text-gray-700">
                            Cấp chất lượng <span className="text-red-500">*</span>
                          </label>
                          <select
                            id="quality_grade"
                            name="quality_grade"
                            value={formState.quality_grade}
                            onChange={handleChange}
                            className={`mt-1 block w-full rounded-md border ${errors.quality_grade ? 'border-red-300' : 'border-gray-300'} px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
                          >
                            <option value="A">A - Tốt nhất</option>
                            <option value="B">B - Tốt</option>
                            <option value="C">C - Trung bình</option>
                            <option value="D">D - Kém</option>
                          </select>
                          {errors.quality_grade && (
                            <p className="mt-2 text-sm text-red-600">{errors.quality_grade}</p>
                          )}
                        </div>
                        
                        <div className="col-span-2">
                          <label htmlFor="defect_notes" className="block text-sm font-medium text-gray-700">
                            Ghi chú lỗi
                          </label>
                          <textarea
                            id="defect_notes"
                            name="defect_notes"
                            rows={2}
                            value={formState.defect_notes || ''}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                            Vị trí <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="location"
                            id="location"
                            value={formState.location}
                            onChange={handleChange}
                            className={`mt-1 block w-full rounded-md border ${errors.location ? 'border-red-300' : 'border-gray-300'} px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
                            placeholder="VD: Kho A - Kệ B2"
                          />
                          {errors.location && (
                            <p className="mt-2 text-sm text-red-600">{errors.location}</p>
                          )}
                        </div>
                        
                        <div>
                          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                            Trạng thái <span className="text-red-500">*</span>
                          </label>
                          <select
                            id="status"
                            name="status"
                            value={formState.status}
                            onChange={handleChange}
                            className={`mt-1 block w-full rounded-md border ${errors.status ? 'border-red-300' : 'border-gray-300'} px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
                          >
                            <option value="available">Có sẵn</option>
                            <option value="reserved">Đã đặt trước</option>
                            <option value="in_use">Đang sử dụng</option>
                            <option value="defective">Có lỗi</option>
                          </select>
                          {errors.status && (
                            <p className="mt-2 text-sm text-red-600">{errors.status}</p>
                          )}
                        </div>
                        
                        <div className="col-span-2">
                          <label htmlFor="roll_id" className="block text-sm font-medium text-gray-700">
                            Mã nội bộ (tự động tạo nếu để trống)
                          </label>
                          <input
                            type="text"
                            name="roll_id"
                            id="roll_id"
                            value={formState.roll_id}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            placeholder="Để trống sẽ tự tạo từ mã sản xuất"
                          />
                        </div>
                      </div>
                    </details>
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
              {bulkMode ? 'Nhập hàng loạt' : 'Nhập kho'}
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

export default InventoryForm; 