import React, { useState, useEffect } from 'react';
import { FabricIssue, FabricInventory, CuttingOrder } from '../../mocks/fabric-management.mock';

interface Employee {
  id: number;
  name: string;
}

interface FabricIssueFormProps {
  issue?: FabricIssue | null;
  inventory: FabricInventory[];
  cuttingOrders: CuttingOrder[];
  employees: Employee[];
  onSave: (issue: Omit<FabricIssue, 'id' | 'created_at' | 'updated_at'>, selectedInventoryItems: number[]) => void;
  onCancel: () => void;
}

interface InventoryItem extends FabricInventory {
  selected: boolean;
}

const FabricIssueForm: React.FC<FabricIssueFormProps> = ({ 
  issue, 
  inventory, 
  cuttingOrders, 
  employees, 
  onSave, 
  onCancel 
}) => {
  const [formState, setFormState] = useState<Omit<FabricIssue, 'id' | 'created_at' | 'updated_at'>>({
    issue_code: '',
    issue_date: new Date().toISOString().split('T')[0],
    production_order_id: null,
    production_order_no: '',
    cutting_order_id: null,
    cutting_order_no: '',
    issued_by: 0,
    issued_by_name: '',
    received_by: 0,
    received_by_name: '',
    status: 'pending',
    notes: '',
    total_rolls: 0,
    total_length: 0,
    total_weight: 0
  });

  const [availableInventory, setAvailableInventory] = useState<InventoryItem[]>([]);
  const [selectedInventoryIds, setSelectedInventoryIds] = useState<number[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Khởi tạo form khi có dữ liệu
  useEffect(() => {
    if (issue) {
      setFormState({
        issue_code: issue.issue_code,
        issue_date: new Date(issue.issue_date).toISOString().split('T')[0],
        production_order_id: issue.production_order_id,
        production_order_no: issue.production_order_no || '',
        cutting_order_id: issue.cutting_order_id,
        cutting_order_no: issue.cutting_order_no || '',
        issued_by: issue.issued_by,
        issued_by_name: issue.issued_by_name || '',
        received_by: issue.received_by,
        received_by_name: issue.received_by_name || '',
        status: issue.status,
        notes: issue.notes || '',
        total_rolls: issue.total_rolls,
        total_length: issue.total_length,
        total_weight: issue.total_weight
      });
      
      // TODO: Cần phải lấy danh sách các inventory items đã chọn từ FabricIssueItems
      setSelectedInventoryIds([]);
    }
  }, [issue]);

  // Lọc kho vải chỉ hiển thị các cuộn khả dụng
  useEffect(() => {
    const filteredInventory = inventory
      .filter(item => item.status === 'available')
      .map(item => ({
        ...item,
        selected: selectedInventoryIds.includes(item.id)
      }));
    
    setAvailableInventory(filteredInventory);
  }, [inventory, selectedInventoryIds]);

  // Cập nhật thông tin khi chọn lệnh cắt
  const handleCuttingOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cuttingOrderId = parseInt(e.target.value);
    const selectedOrder = cuttingOrders.find(order => order.id === cuttingOrderId);
    
    if (selectedOrder) {
      setFormState(prev => ({
        ...prev,
        cutting_order_id: cuttingOrderId,
        cutting_order_no: selectedOrder.order_no,
        production_order_id: selectedOrder.production_order_id,
        production_order_no: selectedOrder.production_order_no || ''
      }));
    } else {
      setFormState(prev => ({
        ...prev,
        cutting_order_id: null,
        cutting_order_no: '',
        production_order_id: null,
        production_order_no: ''
      }));
    }
  };

  // Cập nhật người xuất
  const handleIssuedByChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const employeeId = parseInt(e.target.value);
    const selectedEmployee = employees.find(emp => emp.id === employeeId);
    
    if (selectedEmployee) {
      setFormState(prev => ({
        ...prev,
        issued_by: employeeId,
        issued_by_name: selectedEmployee.name
      }));
    }
  };

  // Cập nhật người nhận
  const handleReceivedByChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const employeeId = parseInt(e.target.value);
    const selectedEmployee = employees.find(emp => emp.id === employeeId);
    
    if (selectedEmployee) {
      setFormState(prev => ({
        ...prev,
        received_by: employeeId,
        received_by_name: selectedEmployee.name
      }));
    }
  };

  // Xử lý khi thay đổi trường input thông thường
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Xử lý khi chọn/bỏ chọn cuộn vải
  const handleInventorySelection = (id: number, selected: boolean) => {
    if (selected) {
      setSelectedInventoryIds(prev => [...prev, id]);
    } else {
      setSelectedInventoryIds(prev => prev.filter(itemId => itemId !== id));
    }
  };

  // Cập nhật tổng dữ liệu khi danh sách vải được chọn thay đổi
  useEffect(() => {
    const selectedItems = availableInventory.filter(item => selectedInventoryIds.includes(item.id));
    const totalRolls = selectedItems.length;
    const totalLength = selectedItems.reduce((sum, item) => sum + item.length, 0);
    const totalWeight = selectedItems.reduce((sum, item) => sum + item.weight, 0);
    
    setFormState(prev => ({
      ...prev,
      total_rolls: totalRolls,
      total_length: totalLength,
      total_weight: totalWeight
    }));
  }, [selectedInventoryIds, availableInventory]);

  // Kiểm tra dữ liệu trước khi lưu
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formState.issue_code.trim()) {
      newErrors.issue_code = 'Vui lòng nhập mã phiếu xuất';
    }
    
    if (!formState.issue_date) {
      newErrors.issue_date = 'Vui lòng chọn ngày xuất';
    }
    
    if (!formState.cutting_order_id) {
      newErrors.cutting_order_id = 'Vui lòng chọn lệnh cắt';
    }
    
    if (!formState.issued_by) {
      newErrors.issued_by = 'Vui lòng chọn người xuất';
    }
    
    if (!formState.received_by) {
      newErrors.received_by = 'Vui lòng chọn người nhận';
    }
    
    if (selectedInventoryIds.length === 0) {
      newErrors.inventory = 'Vui lòng chọn ít nhất một cuộn vải';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave(formState, selectedInventoryIds);
    }
  };

  const generateIssueCode = () => {
    const today = new Date();
    const year = today.getFullYear().toString().slice(-2);
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const newCode = `PXV-${year}${month}${random}`;
    
    setFormState(prev => ({
      ...prev,
      issue_code: newCode
    }));
  };

  return (
    <div className="fixed inset-0 z-10 overflow-y-auto bg-gray-500 bg-opacity-75">
      <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-6xl sm:align-middle">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 w-full text-center sm:mt-0 sm:text-left">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    {issue ? 'Chỉnh sửa phiếu xuất vải' : 'Tạo phiếu xuất vải mới'}
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
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <div className="relative">
                        <label htmlFor="issue_code" className="block text-sm font-medium text-gray-700">
                          Mã phiếu xuất <span className="text-red-500">*</span>
                        </label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                          <input
                            type="text"
                            name="issue_code"
                            id="issue_code"
                            value={formState.issue_code}
                            onChange={handleInputChange}
                            className={`block w-full rounded-md border ${errors.issue_code ? 'border-red-300' : 'border-gray-300'} px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
                          />
                          <button
                            type="button"
                            onClick={generateIssueCode}
                            className="ml-2 inline-flex items-center rounded-md border border-gray-300 bg-gray-50 px-2 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                          >
                            Tự động
                          </button>
                        </div>
                        {errors.issue_code && <p className="mt-2 text-sm text-red-600">{errors.issue_code}</p>}
                      </div>
                      
                      <div>
                        <label htmlFor="issue_date" className="block text-sm font-medium text-gray-700">
                          Ngày xuất <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          name="issue_date"
                          id="issue_date"
                          value={formState.issue_date}
                          onChange={handleInputChange}
                          className={`mt-1 block w-full rounded-md border ${errors.issue_date ? 'border-red-300' : 'border-gray-300'} px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
                        />
                        {errors.issue_date && <p className="mt-2 text-sm text-red-600">{errors.issue_date}</p>}
                      </div>
                      
                      <div>
                        <label htmlFor="cutting_order_id" className="block text-sm font-medium text-gray-700">
                          Lệnh cắt <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="cutting_order_id"
                          name="cutting_order_id"
                          value={formState.cutting_order_id || ''}
                          onChange={handleCuttingOrderChange}
                          className={`mt-1 block w-full rounded-md border ${errors.cutting_order_id ? 'border-red-300' : 'border-gray-300'} px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
                        >
                          <option value="">Chọn lệnh cắt</option>
                          {cuttingOrders.map(order => (
                            <option key={order.id} value={order.id}>
                              {order.order_no}
                            </option>
                          ))}
                        </select>
                        {errors.cutting_order_id && <p className="mt-2 text-sm text-red-600">{errors.cutting_order_id}</p>}
                      </div>
                      
                      <div>
                        <label htmlFor="production_order_no" className="block text-sm font-medium text-gray-700">
                          Lệnh sản xuất
                        </label>
                        <input
                          type="text"
                          name="production_order_no"
                          id="production_order_no"
                          value={formState.production_order_no || ''}
                          readOnly
                          className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="issued_by" className="block text-sm font-medium text-gray-700">
                          Người xuất <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="issued_by"
                          name="issued_by"
                          value={formState.issued_by || ''}
                          onChange={handleIssuedByChange}
                          className={`mt-1 block w-full rounded-md border ${errors.issued_by ? 'border-red-300' : 'border-gray-300'} px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
                        >
                          <option value="">Chọn nhân viên</option>
                          {employees.map(employee => (
                            <option key={employee.id} value={employee.id}>
                              {employee.name}
                            </option>
                          ))}
                        </select>
                        {errors.issued_by && <p className="mt-2 text-sm text-red-600">{errors.issued_by}</p>}
                      </div>
                      
                      <div>
                        <label htmlFor="received_by" className="block text-sm font-medium text-gray-700">
                          Người nhận <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="received_by"
                          name="received_by"
                          value={formState.received_by || ''}
                          onChange={handleReceivedByChange}
                          className={`mt-1 block w-full rounded-md border ${errors.received_by ? 'border-red-300' : 'border-gray-300'} px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
                        >
                          <option value="">Chọn nhân viên</option>
                          {employees.map(employee => (
                            <option key={employee.id} value={employee.id}>
                              {employee.name}
                            </option>
                          ))}
                        </select>
                        {errors.received_by && <p className="mt-2 text-sm text-red-600">{errors.received_by}</p>}
                      </div>
                      
                      <div className="sm:col-span-3">
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                          Ghi chú
                        </label>
                        <textarea
                          id="notes"
                          name="notes"
                          rows={2}
                          value={formState.notes || ''}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <h4 className="text-md font-medium text-gray-900">Danh sách vải xuất</h4>
                      {errors.inventory && <p className="mt-2 text-sm text-red-600">{errors.inventory}</p>}
                      
                      <div className="mt-4 overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Chọn
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Mã cuộn
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Loại vải
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Màu
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Chiều dài (m)
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Khổ (cm)
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Trọng lượng (kg)
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Chất lượng
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Vị trí
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {availableInventory.length === 0 ? (
                              <tr>
                                <td colSpan={9} className="px-6 py-4 text-center text-sm text-gray-500">
                                  Không có vải khả dụng trong kho
                                </td>
                              </tr>
                            ) : (
                              availableInventory.map((item) => (
                                <tr key={item.id} className={item.selected ? "bg-indigo-50" : ""}>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <input
                                      type="checkbox"
                                      checked={item.selected}
                                      onChange={(e) => handleInventorySelection(item.id, e.target.checked)}
                                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {item.roll_id}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {item.fabric_name}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                      <div 
                                        className="h-6 w-6 rounded-full border border-gray-300" 
                                        style={{ backgroundColor: item.color_code }}
                                      ></div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {item.length}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {item.width}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {item.weight}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {item.quality_grade}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {item.location}
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                          <tfoot className="bg-gray-50">
                            <tr>
                              <td colSpan={4} className="px-6 py-3 text-right text-sm font-medium text-gray-900">
                                Tổng:
                              </td>
                              <td className="px-6 py-3 text-sm font-medium text-gray-900">
                                {formState.total_length.toLocaleString('vi-VN')} m
                              </td>
                              <td className="px-6 py-3 text-sm font-medium text-gray-900">
                                -
                              </td>
                              <td className="px-6 py-3 text-sm font-medium text-gray-900">
                                {formState.total_weight.toLocaleString('vi-VN')} kg
                              </td>
                              <td colSpan={2} className="px-6 py-3 text-sm font-medium text-gray-900">
                                Số cuộn: {formState.total_rolls}
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="submit"
                className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
              >
                {issue ? 'Cập nhật' : 'Lưu'}
              </button>
              <button
                type="button"
                className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                onClick={onCancel}
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FabricIssueForm; 