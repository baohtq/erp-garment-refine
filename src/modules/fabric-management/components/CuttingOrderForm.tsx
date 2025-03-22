import React, { useState, useEffect } from 'react';
import { CuttingOrder, Fabric, ProductionOrder, Employee } from '../../mocks/fabric-management.mock';

interface CuttingOrderFormProps {
  cuttingOrder?: CuttingOrder | null;
  fabrics: Fabric[];
  productionOrders: ProductionOrder[];
  employees: Employee[];
  onSave: (order: Omit<CuttingOrder, 'id' | 'created_at' | 'updated_at'>, fabricDetails: { fabric_id: number, required_length: number, pieces_count: number, layers_count: number }[]) => void;
  onCancel: () => void;
}

const CuttingOrderForm: React.FC<CuttingOrderFormProps> = ({
  cuttingOrder,
  fabrics,
  productionOrders,
  employees,
  onSave,
  onCancel
}) => {
  const [formState, setFormState] = useState<Omit<CuttingOrder, 'id' | 'created_at' | 'updated_at'>>({
    order_no: '',
    production_order_id: 0,
    production_order_no: '',
    planned_start_date: new Date().toISOString().split('T')[0],
    planned_end_date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Mặc định 1 ngày sau
    actual_start_date: null,
    actual_end_date: null,
    status: 'pending',
    notes: null,
    created_by: 0
  });

  const [fabricDetails, setFabricDetails] = useState<{ 
    fabric_id: number, 
    fabric_name: string,
    required_length: number, 
    pieces_count: number, 
    layers_count: number 
  }[]>([]);
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Khởi tạo form khi có dữ liệu
  useEffect(() => {
    if (cuttingOrder) {
      setFormState({
        order_no: cuttingOrder.order_no,
        production_order_id: cuttingOrder.production_order_id,
        production_order_no: cuttingOrder.production_order_no || '',
        planned_start_date: new Date(cuttingOrder.planned_start_date).toISOString().split('T')[0],
        planned_end_date: new Date(cuttingOrder.planned_end_date).toISOString().split('T')[0],
        actual_start_date: cuttingOrder.actual_start_date ? new Date(cuttingOrder.actual_start_date).toISOString().split('T')[0] : null,
        actual_end_date: cuttingOrder.actual_end_date ? new Date(cuttingOrder.actual_end_date).toISOString().split('T')[0] : null,
        status: cuttingOrder.status,
        notes: cuttingOrder.notes,
        created_by: cuttingOrder.created_by
      });
      
      // TODO: Cần phải lấy danh sách chi tiết vải từ CuttingOrderDetails
      // Hiện tại chỉ là mẫu
      setFabricDetails([{
        fabric_id: 1,
        fabric_name: "Kaki thun 2 chiều",
        required_length: 150,
        pieces_count: 120,
        layers_count: 20
      }]);
    }
  }, [cuttingOrder]);

  // Xử lý khi thay đổi trường input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Xử lý khi chọn đơn đặt hàng
  const handleProductionOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const productionOrderId = parseInt(e.target.value);
    const selectedOrder = productionOrders.find(order => order.id === productionOrderId);
    
    if (selectedOrder) {
      setFormState(prev => ({
        ...prev,
        production_order_id: productionOrderId,
        production_order_no: selectedOrder.order_number
      }));
      
      // TODO: Cần lấy thông tin vải từ đơn đặt hàng
      // Hiện tại chỉ là mẫu
      setFabricDetails([{
        fabric_id: 1,
        fabric_name: "Kaki thun 2 chiều",
        required_length: 150,
        pieces_count: 120,
        layers_count: 20
      }]);
    } else {
      setFormState(prev => ({
        ...prev,
        production_order_id: 0,
        production_order_no: ''
      }));
      setFabricDetails([]);
    }
  };

  // Xử lý khi thay đổi thông tin vải
  const handleFabricDetailChange = (index: number, field: string, value: string | number) => {
    const updatedDetails = [...fabricDetails];
    updatedDetails[index] = {
      ...updatedDetails[index],
      [field]: typeof value === 'string' && field !== 'fabric_name' ? parseFloat(value) || 0 : value
    };
    setFabricDetails(updatedDetails);
  };

  // Thêm loại vải mới vào lệnh cắt
  const handleAddFabric = () => {
    setFabricDetails([
      ...fabricDetails,
      {
        fabric_id: 0,
        fabric_name: '',
        required_length: 0,
        pieces_count: 0,
        layers_count: 0
      }
    ]);
  };

  // Xóa loại vải khỏi lệnh cắt
  const handleRemoveFabric = (index: number) => {
    const updatedDetails = [...fabricDetails];
    updatedDetails.splice(index, 1);
    setFabricDetails(updatedDetails);
  };

  // Sinh mã lệnh cắt mới
  const generateOrderNo = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const newOrderNo = `CUT-${year}-${month}${random}`;
    
    setFormState(prev => ({
      ...prev,
      order_no: newOrderNo
    }));
  };

  // Kiểm tra dữ liệu trước khi lưu
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formState.order_no.trim()) {
      newErrors.order_no = 'Vui lòng nhập mã lệnh cắt';
    }
    
    if (!formState.production_order_id) {
      newErrors.production_order_id = 'Vui lòng chọn lệnh sản xuất';
    }
    
    if (!formState.planned_start_date) {
      newErrors.planned_start_date = 'Vui lòng chọn ngày bắt đầu dự kiến';
    }
    
    if (!formState.planned_end_date) {
      newErrors.planned_end_date = 'Vui lòng chọn ngày kết thúc dự kiến';
    }
    
    if (!formState.created_by) {
      newErrors.created_by = 'Vui lòng chọn người tạo lệnh';
    }
    
    if (fabricDetails.length === 0) {
      newErrors.fabricDetails = 'Vui lòng thêm ít nhất một loại vải';
    } else {
      const invalidFabrics = fabricDetails.some(detail => !detail.fabric_id || detail.required_length <= 0);
      if (invalidFabrics) {
        newErrors.fabricDetails = 'Thông tin vải không hợp lệ. Vui lòng kiểm tra lại.';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Xử lý khi submit form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const fabricDetailsToSave = fabricDetails.map(detail => ({
        fabric_id: detail.fabric_id,
        required_length: detail.required_length,
        pieces_count: detail.pieces_count,
        layers_count: detail.layers_count
      }));
      
      onSave(formState, fabricDetailsToSave);
    }
  };

  return (
    <div className="fixed inset-0 z-10 overflow-y-auto bg-gray-500 bg-opacity-75">
      <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl sm:align-middle">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 w-full text-center sm:mt-0 sm:text-left">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    {cuttingOrder ? 'Chỉnh sửa lệnh cắt' : 'Tạo lệnh cắt mới'}
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
                        <label htmlFor="order_no" className="block text-sm font-medium text-gray-700">
                          Mã lệnh cắt <span className="text-red-500">*</span>
                        </label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                          <input
                            type="text"
                            name="order_no"
                            id="order_no"
                            value={formState.order_no}
                            onChange={handleInputChange}
                            className={`block w-full rounded-md border ${errors.order_no ? 'border-red-300' : 'border-gray-300'} px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
                          />
                          <button
                            type="button"
                            onClick={generateOrderNo}
                            className="ml-2 inline-flex items-center rounded-md border border-gray-300 bg-gray-50 px-2 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                          >
                            Tự động
                          </button>
                        </div>
                        {errors.order_no && <p className="mt-2 text-sm text-red-600">{errors.order_no}</p>}
                      </div>
                      
                      <div>
                        <label htmlFor="production_order_id" className="block text-sm font-medium text-gray-700">
                          Lệnh sản xuất <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="production_order_id"
                          name="production_order_id"
                          value={formState.production_order_id || ''}
                          onChange={handleProductionOrderChange}
                          className={`mt-1 block w-full rounded-md border ${errors.production_order_id ? 'border-red-300' : 'border-gray-300'} px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
                        >
                          <option value="">Chọn lệnh sản xuất</option>
                          {productionOrders.map(order => (
                            <option key={order.id} value={order.id}>
                              {order.order_number}
                            </option>
                          ))}
                        </select>
                        {errors.production_order_id && <p className="mt-2 text-sm text-red-600">{errors.production_order_id}</p>}
                      </div>
                      
                      <div>
                        <label htmlFor="created_by" className="block text-sm font-medium text-gray-700">
                          Người tạo lệnh <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="created_by"
                          name="created_by"
                          value={formState.created_by || ''}
                          onChange={handleInputChange}
                          className={`mt-1 block w-full rounded-md border ${errors.created_by ? 'border-red-300' : 'border-gray-300'} px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
                        >
                          <option value="">Chọn người tạo</option>
                          {employees.map(employee => (
                            <option key={employee.id} value={employee.id}>
                              {employee.name}
                            </option>
                          ))}
                        </select>
                        {errors.created_by && <p className="mt-2 text-sm text-red-600">{errors.created_by}</p>}
                      </div>
                      
                      <div>
                        <label htmlFor="planned_start_date" className="block text-sm font-medium text-gray-700">
                          Ngày bắt đầu dự kiến <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          name="planned_start_date"
                          id="planned_start_date"
                          value={formState.planned_start_date}
                          onChange={handleInputChange}
                          className={`mt-1 block w-full rounded-md border ${errors.planned_start_date ? 'border-red-300' : 'border-gray-300'} px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
                        />
                        {errors.planned_start_date && <p className="mt-2 text-sm text-red-600">{errors.planned_start_date}</p>}
                      </div>
                      
                      <div>
                        <label htmlFor="planned_end_date" className="block text-sm font-medium text-gray-700">
                          Ngày kết thúc dự kiến <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          name="planned_end_date"
                          id="planned_end_date"
                          value={formState.planned_end_date}
                          onChange={handleInputChange}
                          className={`mt-1 block w-full rounded-md border ${errors.planned_end_date ? 'border-red-300' : 'border-gray-300'} px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
                        />
                        {errors.planned_end_date && <p className="mt-2 text-sm text-red-600">{errors.planned_end_date}</p>}
                      </div>
                      
                      <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                          Trạng thái
                        </label>
                        <select
                          id="status"
                          name="status"
                          value={formState.status}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        >
                          <option value="pending">Chờ xử lý</option>
                          <option value="in-progress">Đang thực hiện</option>
                          <option value="completed">Hoàn thành</option>
                          <option value="cancelled">Đã hủy</option>
                        </select>
                      </div>
                      
                      {formState.status === 'in-progress' && (
                        <div>
                          <label htmlFor="actual_start_date" className="block text-sm font-medium text-gray-700">
                            Ngày bắt đầu thực tế
                          </label>
                          <input
                            type="date"
                            name="actual_start_date"
                            id="actual_start_date"
                            value={formState.actual_start_date || ''}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                          />
                        </div>
                      )}
                      
                      {formState.status === 'completed' && (
                        <>
                          <div>
                            <label htmlFor="actual_start_date" className="block text-sm font-medium text-gray-700">
                              Ngày bắt đầu thực tế
                            </label>
                            <input
                              type="date"
                              name="actual_start_date"
                              id="actual_start_date"
                              value={formState.actual_start_date || ''}
                              onChange={handleInputChange}
                              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            />
                          </div>
                          <div>
                            <label htmlFor="actual_end_date" className="block text-sm font-medium text-gray-700">
                              Ngày kết thúc thực tế
                            </label>
                            <input
                              type="date"
                              name="actual_end_date"
                              id="actual_end_date"
                              value={formState.actual_end_date || ''}
                              onChange={handleInputChange}
                              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            />
                          </div>
                        </>
                      )}
                      
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
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-md font-medium text-gray-900">Chi tiết vải sử dụng</h4>
                        <button
                          type="button"
                          onClick={handleAddFabric}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Thêm vải
                        </button>
                      </div>
                      
                      {errors.fabricDetails && (
                        <div className="mb-4 rounded-md bg-red-50 p-2">
                          <p className="text-sm text-red-600">{errors.fabricDetails}</p>
                        </div>
                      )}
                      
                      {fabricDetails.length === 0 ? (
                        <div className="text-center py-4 bg-gray-50 rounded-md border border-gray-200">
                          <p className="text-sm text-gray-500">Chưa có vải nào được thêm. Vui lòng chọn lệnh sản xuất hoặc thêm vải thủ công.</p>
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="min-w-full border divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Loại vải
                                </th>
                                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Chiều dài yêu cầu (m)
                                </th>
                                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Số lớp
                                </th>
                                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Số bộ
                                </th>
                                <th scope="col" className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Thao tác
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {fabricDetails.map((detail, index) => (
                                <tr key={index}>
                                  <td className="px-4 py-2 whitespace-nowrap">
                                    <select
                                      value={detail.fabric_id}
                                      onChange={(e) => handleFabricDetailChange(index, 'fabric_id', parseInt(e.target.value))}
                                      className="block w-full rounded-md border border-gray-300 px-3 py-1 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                    >
                                      <option value="">Chọn loại vải</option>
                                      {fabrics.map(fabric => (
                                        <option key={fabric.id} value={fabric.id}>
                                          {fabric.name}
                                        </option>
                                      ))}
                                    </select>
                                  </td>
                                  <td className="px-4 py-2 whitespace-nowrap">
                                    <input
                                      type="number"
                                      min="0"
                                      step="0.1"
                                      value={detail.required_length}
                                      onChange={(e) => handleFabricDetailChange(index, 'required_length', e.target.value)}
                                      className="block w-full rounded-md border border-gray-300 px-3 py-1 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                    />
                                  </td>
                                  <td className="px-4 py-2 whitespace-nowrap">
                                    <input
                                      type="number"
                                      min="0"
                                      value={detail.layers_count}
                                      onChange={(e) => handleFabricDetailChange(index, 'layers_count', e.target.value)}
                                      className="block w-full rounded-md border border-gray-300 px-3 py-1 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                    />
                                  </td>
                                  <td className="px-4 py-2 whitespace-nowrap">
                                    <input
                                      type="number"
                                      min="0"
                                      value={detail.pieces_count}
                                      onChange={(e) => handleFabricDetailChange(index, 'pieces_count', e.target.value)}
                                      className="block w-full rounded-md border border-gray-300 px-3 py-1 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                    />
                                  </td>
                                  <td className="px-4 py-2 whitespace-nowrap text-center">
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveFabric(index)}
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
                      )}
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
                {cuttingOrder ? 'Cập nhật' : 'Tạo lệnh cắt'}
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

export default CuttingOrderForm; 