import React, { useState, useEffect } from 'react';
import { FabricInventory, Fabric } from '../../mocks/fabric-management.mock';

// Interface cho đối tượng kiểm kê
export interface InventoryCheck {
  id: number;
  check_code: string;
  check_date: string;
  status: 'draft' | 'in-progress' | 'completed';
  notes: string | null;
  created_by: number;
  created_at: string;
  updated_at: string;
}

// Interface cho chi tiết kiểm kê
export interface InventoryCheckItem {
  id: number;
  inventory_check_id: number;
  inventory_id: number;
  fabric_id: number;
  fabric_name: string;
  roll_id: string;
  system_length: number;
  system_weight: number;
  actual_length: number | null;
  actual_weight: number | null;
  length_difference: number | null;
  weight_difference: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

interface InventoryCheckFormProps {
  inventoryCheck?: InventoryCheck;
  inventoryItems: FabricInventory[];
  fabrics: Fabric[];
  onSave: (checkData: InventoryCheck, checkItems: InventoryCheckItem[]) => void;
  onCancel: () => void;
}

const InventoryCheckForm: React.FC<InventoryCheckFormProps> = ({
  inventoryCheck,
  inventoryItems,
  fabrics,
  onSave,
  onCancel
}) => {
  // Dữ liệu kiểm kê
  const [formData, setFormData] = useState<Omit<InventoryCheck, 'id' | 'created_at' | 'updated_at'>>({
    check_code: '',
    check_date: new Date().toISOString().split('T')[0],
    status: 'draft',
    notes: '',
    created_by: 1, // ID người dùng mặc định
  });

  // Danh sách vật liệu kiểm kê
  const [checkItems, setCheckItems] = useState<Omit<InventoryCheckItem, 'id' | 'created_at' | 'updated_at'>[]>([]);
  
  // Lọc vật liệu
  const [fabricFilter, setFabricFilter] = useState<string>('');
  
  // Danh sách các vật liệu đã chọn để kiểm kê
  const [selectedInventoryIds, setSelectedInventoryIds] = useState<number[]>([]);

  // Danh sách lỗi trong form
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Khởi tạo dữ liệu form nếu đang chỉnh sửa
  useEffect(() => {
    if (inventoryCheck) {
      setFormData({
        check_code: inventoryCheck.check_code,
        check_date: new Date(inventoryCheck.check_date).toISOString().split('T')[0],
        status: inventoryCheck.status,
        notes: inventoryCheck.notes,
        created_by: inventoryCheck.created_by,
      });
    }
  }, [inventoryCheck]);

  // Xử lý thay đổi dữ liệu form
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Xử lý khi thay đổi filter loại vật liệu
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFabricFilter(e.target.value);
  };

  // Thêm một vật liệu vào danh sách kiểm kê
  const handleAddInventoryItem = (inventoryId: number) => {
    // Nếu đã thêm rồi thì không thêm nữa
    if (selectedInventoryIds.includes(inventoryId)) {
      return;
    }

    // Tìm thông tin vật liệu
    const inventory = inventoryItems.find(item => item.id === inventoryId);
    if (!inventory) return;

    // Tìm tên vật liệu
    const fabric = fabrics.find(f => f.id === inventory.fabric_id);
    
    // Tạo đối tượng chi tiết kiểm kê mới
    const newCheckItem: Omit<InventoryCheckItem, 'id' | 'created_at' | 'updated_at'> = {
      inventory_check_id: inventoryCheck?.id || 0,
      inventory_id: inventory.id,
      fabric_id: inventory.fabric_id,
      fabric_name: fabric?.name || `Fabric ID: ${inventory.fabric_id}`,
      roll_id: inventory.roll_id,
      system_length: inventory.length,
      system_weight: inventory.weight,
      actual_length: null,
      actual_weight: null,
      length_difference: null,
      weight_difference: null,
      notes: null,
    };

    // Thêm vào danh sách
    setCheckItems(prev => [...prev, newCheckItem]);
    setSelectedInventoryIds(prev => [...prev, inventoryId]);
  };

  // Xóa một vật liệu khỏi danh sách kiểm kê
  const handleRemoveInventoryItem = (inventoryId: number) => {
    setCheckItems(prev => prev.filter(item => item.inventory_id !== inventoryId));
    setSelectedInventoryIds(prev => prev.filter(id => id !== inventoryId));
  };

  // Cập nhật thông tin thực tế sau kiểm kê
  const handleUpdateCheckItem = (inventoryId: number, field: string, value: string) => {
    setCheckItems(prev => prev.map(item => {
      if (item.inventory_id === inventoryId) {
        const updatedItem = { ...item, [field]: parseFloat(value) || null };
        
        // Tính toán độ chênh lệch nếu cả hai giá trị thực tế và hệ thống đều có
        if (field === 'actual_length' && updatedItem.actual_length !== null) {
          updatedItem.length_difference = updatedItem.actual_length - updatedItem.system_length;
        }
        
        if (field === 'actual_weight' && updatedItem.actual_weight !== null) {
          updatedItem.weight_difference = updatedItem.actual_weight - updatedItem.system_weight;
        }
        
        return updatedItem;
      }
      return item;
    }));
  };

  // Cập nhật ghi chú cho một mục kiểm kê
  const handleUpdateItemNotes = (inventoryId: number, notes: string) => {
    setCheckItems(prev => prev.map(item => {
      if (item.inventory_id === inventoryId) {
        return { ...item, notes };
      }
      return item;
    }));
  };

  // Xác thực dữ liệu form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.check_code.trim()) {
      newErrors.check_code = 'Vui lòng nhập mã kiểm kê';
    }

    if (!formData.check_date) {
      newErrors.check_date = 'Vui lòng chọn ngày kiểm kê';
    }

    if (checkItems.length === 0) {
      newErrors.checkItems = 'Vui lòng thêm ít nhất một vật liệu để kiểm kê';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Xử lý khi lưu form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Tạo dữ liệu kiểm kê để lưu
    const checkData: InventoryCheck = {
      id: inventoryCheck?.id || 0,
      ...formData,
      created_at: inventoryCheck?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Chuẩn bị dữ liệu chi tiết kiểm kê
    const checkItemsData: InventoryCheckItem[] = checkItems.map((item, index) => ({
      id: index + 1, // Tạm thời gán ID tăng dần
      ...item,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));

    // Gọi hàm lưu dữ liệu
    onSave(checkData, checkItemsData);
  };

  // Lọc danh sách vật liệu theo loại vải đã chọn
  const filteredInventoryItems = fabricFilter 
    ? inventoryItems.filter(item => item.fabric_id.toString() === fabricFilter) 
    : inventoryItems;

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          {inventoryCheck ? 'Chỉnh sửa phiếu kiểm kê' : 'Tạo phiếu kiểm kê mới'}
        </h2>
        <button
          type="button"
          className="text-gray-500 hover:text-gray-700"
          onClick={onCancel}
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Thông tin cơ bản của phiếu kiểm kê */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mã kiểm kê
            </label>
            <input
              type="text"
              name="check_code"
              value={formData.check_code}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border ${
                errors.check_code ? 'border-red-500' : 'border-gray-300'
              } px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
              placeholder="VD: KK-2023-001"
            />
            {errors.check_code && (
              <p className="mt-1 text-sm text-red-500">{errors.check_code}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Ngày kiểm kê
            </label>
            <input
              type="date"
              name="check_date"
              value={formData.check_date}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border ${
                errors.check_date ? 'border-red-500' : 'border-gray-300'
              } px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
            />
            {errors.check_date && (
              <p className="mt-1 text-sm text-red-500">{errors.check_date}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Trạng thái
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            >
              <option value="draft">Bản nháp</option>
              <option value="in-progress">Đang tiến hành</option>
              <option value="completed">Hoàn thành</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Ghi chú
            </label>
            <textarea
              name="notes"
              value={formData.notes || ''}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              placeholder="Ghi chú về việc kiểm kê"
            ></textarea>
          </div>
        </div>

        {/* Danh sách vật liệu cần kiểm kê */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Danh sách vật liệu kiểm kê</h3>
          
          {errors.checkItems && (
            <p className="mb-4 text-sm text-red-500 font-medium">{errors.checkItems}</p>
          )}

          <div className="flex flex-col md:flex-row md:space-x-4 mb-4">
            <div className="w-full md:w-1/3 mb-4 md:mb-0">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lọc theo loại vải
              </label>
              <select
                value={fabricFilter}
                onChange={handleFilterChange}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">Tất cả các loại vải</option>
                {fabrics.map(fabric => (
                  <option key={fabric.id} value={fabric.id}>
                    {fabric.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Bảng chọn vật liệu để kiểm kê */}
          <div className="border rounded-lg mb-6 overflow-hidden">
            <div className="max-h-60 overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Chọn
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Mã cuộn
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Loại vải
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Màu
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Chiều dài (m)
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Khối lượng (kg)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredInventoryItems.map(item => {
                    const fabric = fabrics.find(f => f.id === item.fabric_id);
                    const isSelected = selectedInventoryIds.includes(item.id);
                    
                    return (
                      <tr 
                        key={item.id}
                        className={isSelected ? 'bg-indigo-50' : ''}
                      >
                        <td className="px-4 py-3 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {
                              if (isSelected) {
                                handleRemoveInventoryItem(item.id);
                              } else {
                                handleAddInventoryItem(item.id);
                              }
                            }}
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.roll_id}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {fabric?.name || `ID: ${item.fabric_id}`}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <div 
                              className="w-4 h-4 mr-2 rounded-full" 
                              style={{ backgroundColor: item.color_code || '#ccc' }}
                            ></div>
                            {item.color_code}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {item.length.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {item.weight.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                  {filteredInventoryItems.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-4 text-center text-sm text-gray-500">
                        Không có vật liệu nào phù hợp với bộ lọc
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Danh sách vật liệu đã chọn để kiểm kê */}
          {checkItems.length > 0 && (
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-2">Vật liệu đã chọn để kiểm kê ({checkItems.length})</h4>
              <div className="border rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Mã cuộn
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Loại vải
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Dài hệ thống (m)
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Dài thực tế (m)
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        KL hệ thống (kg)
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        KL thực tế (kg)
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Ghi chú
                      </th>
                      <th scope="col" className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {checkItems.map(item => (
                      <tr key={item.inventory_id}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.roll_id}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {item.fabric_name}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {item.system_length.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <input
                            type="number"
                            value={item.actual_length || ''}
                            onChange={(e) => handleUpdateCheckItem(item.inventory_id, 'actual_length', e.target.value)}
                            step="0.01"
                            min="0"
                            className="w-24 rounded-md border border-gray-300 px-2 py-1 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                          />
                          {item.length_difference !== null && (
                            <span className={`ml-2 text-sm ${
                              item.length_difference < 0 ? 'text-red-500' : item.length_difference > 0 ? 'text-green-500' : 'text-gray-500'
                            }`}>
                              {item.length_difference > 0 ? '+' : ''}{item.length_difference.toFixed(2)}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {item.system_weight.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <input
                            type="number"
                            value={item.actual_weight || ''}
                            onChange={(e) => handleUpdateCheckItem(item.inventory_id, 'actual_weight', e.target.value)}
                            step="0.01"
                            min="0"
                            className="w-24 rounded-md border border-gray-300 px-2 py-1 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                          />
                          {item.weight_difference !== null && (
                            <span className={`ml-2 text-sm ${
                              item.weight_difference < 0 ? 'text-red-500' : item.weight_difference > 0 ? 'text-green-500' : 'text-gray-500'
                            }`}>
                              {item.weight_difference > 0 ? '+' : ''}{item.weight_difference.toFixed(2)}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={item.notes || ''}
                            onChange={(e) => handleUpdateItemNotes(item.inventory_id, e.target.value)}
                            className="w-full rounded-md border border-gray-300 px-2 py-1 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            placeholder="Ghi chú"
                          />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-center text-sm font-medium">
                          <button
                            type="button"
                            onClick={() => handleRemoveInventoryItem(item.inventory_id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Xóa
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Các nút thao tác */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {inventoryCheck ? 'Cập nhật' : 'Tạo phiếu kiểm kê'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InventoryCheckForm; 