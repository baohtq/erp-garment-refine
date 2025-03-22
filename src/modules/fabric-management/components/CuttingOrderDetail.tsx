import React, { useState } from 'react';
import { CuttingOrder, CuttingOrderDetail as CuttingOrderDetailType, Employee, FabricIssue } from '../../mocks/fabric-management.mock';

interface CuttingOrderDetailProps {
  cuttingOrder: CuttingOrder;
  cuttingOrderDetails: CuttingOrderDetailType[];
  fabricIssues: FabricIssue[];
  employees: Employee[];
  onUpdateOrderStatus: (orderId: number, status: string, data?: { actual_start_date?: string; actual_end_date?: string; }) => void;
  onUpdateFabricConsumption: (detailId: number, actualConsumed: number, wasteLength: number) => void;
  onClose: () => void;
}

const CuttingOrderDetail: React.FC<CuttingOrderDetailProps> = ({
  cuttingOrder,
  cuttingOrderDetails,
  fabricIssues,
  employees,
  onUpdateOrderStatus,
  onUpdateFabricConsumption,
  onClose
}) => {
  const [consumptionFormData, setConsumptionFormData] = useState<{
    detailId: number | null;
    actualConsumed: number;
    wasteLength: number;
  }>({
    detailId: null,
    actualConsumed: 0,
    wasteLength: 0
  });

  const [editMode, setEditMode] = useState(false);

  // Định dạng ngày giờ
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  // Xử lý khi thay đổi trạng thái
  const handleStatusChange = (newStatus: string) => {
    let additionalData = {};
    
    if (newStatus === 'in-progress' && !cuttingOrder.actual_start_date) {
      additionalData = {
        actual_start_date: new Date().toISOString()
      };
    } else if (newStatus === 'completed' && !cuttingOrder.actual_end_date) {
      additionalData = {
        actual_end_date: new Date().toISOString()
      };
    }

    onUpdateOrderStatus(cuttingOrder.id, newStatus, additionalData);
  };

  // Xử lý khi thay đổi tiêu thụ vải thực tế
  const handleConsumptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConsumptionFormData({
      ...consumptionFormData,
      [name]: parseFloat(value) || 0
    });
  };

  // Xử lý khi lưu thông tin tiêu thụ vải
  const handleSaveConsumption = () => {
    if (consumptionFormData.detailId) {
      onUpdateFabricConsumption(
        consumptionFormData.detailId,
        consumptionFormData.actualConsumed,
        consumptionFormData.wasteLength
      );
      setEditMode(false);
    }
  };

  // Mở form cập nhật tiêu thụ vải
  const handleOpenConsumptionForm = (detail: CuttingOrderDetailType) => {
    setConsumptionFormData({
      detailId: detail.id,
      actualConsumed: detail.actual_consumed_length || detail.required_length,
      wasteLength: detail.waste_length || 0
    });
    setEditMode(true);
  };

  // Tìm người tạo lệnh
  const creator = employees.find(emp => emp.id === cuttingOrder.created_by);

  // Tìm các phiếu xuất vải liên quan
  const relatedIssues = fabricIssues.filter(issue => issue.cutting_order_id === cuttingOrder.id);

  // Tính tổng tiêu thụ vải theo kế hoạch và thực tế
  const totalPlannedConsumption = cuttingOrderDetails.reduce((sum, detail) => sum + detail.required_length, 0);
  const totalActualConsumption = cuttingOrderDetails.reduce((sum, detail) => sum + (detail.actual_consumed_length || 0), 0);
  const totalWaste = cuttingOrderDetails.reduce((sum, detail) => sum + (detail.waste_length || 0), 0);
  
  // Tính tỷ lệ hao hụt trung bình
  const averageWastePercent = totalActualConsumption > 0 
    ? (totalWaste / totalActualConsumption) * 100 
    : 0;

  // Xác định trạng thái xuất vải
  const issuedLength = cuttingOrderDetails.reduce((sum, detail) => sum + detail.fabric_issued_length, 0);
  const issuedStatus = issuedLength >= totalPlannedConsumption 
    ? "Đã xuất đủ vải" 
    : issuedLength > 0 
      ? "Đã xuất một phần vải" 
      : "Chưa xuất vải";

  return (
    <div className="fixed inset-0 z-10 overflow-y-auto bg-gray-500 bg-opacity-75">
      <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-5xl sm:align-middle">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 w-full text-center sm:mt-0 sm:text-left">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Chi tiết lệnh cắt: {cuttingOrder.order_no}
                  </h3>
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                    onClick={onClose}
                  >
                    <span className="sr-only">Đóng</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="mt-4">
                  {/* Thông tin chung lệnh cắt */}
                  <div className="mb-6 grid grid-cols-1 gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4 sm:grid-cols-3">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Lệnh sản xuất:</p>
                      <p className="text-sm font-semibold text-gray-900">{cuttingOrder.production_order_no}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Người tạo:</p>
                      <p className="text-sm font-semibold text-gray-900">{creator?.name || `ID: ${cuttingOrder.created_by}`}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Trạng thái:</p>
                      <div className="mt-1">
                        <select
                          value={cuttingOrder.status}
                          onChange={(e) => handleStatusChange(e.target.value)}
                          disabled={cuttingOrder.status === 'completed' || cuttingOrder.status === 'cancelled'}
                          className="block w-full rounded-md border border-gray-300 py-1 px-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        >
                          <option value="pending">Chờ xử lý</option>
                          <option value="in-progress">Đang thực hiện</option>
                          <option value="completed">Hoàn thành</option>
                          <option value="cancelled">Đã hủy</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Kế hoạch bắt đầu:</p>
                      <p className="text-sm font-semibold text-gray-900">{formatDate(cuttingOrder.planned_start_date)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Kế hoạch kết thúc:</p>
                      <p className="text-sm font-semibold text-gray-900">{formatDate(cuttingOrder.planned_end_date)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Trạng thái xuất vải:</p>
                      <p className="text-sm font-semibold text-gray-900">{issuedStatus}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Bắt đầu thực tế:</p>
                      <p className="text-sm font-semibold text-gray-900">{formatDate(cuttingOrder.actual_start_date)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Kết thúc thực tế:</p>
                      <p className="text-sm font-semibold text-gray-900">{formatDate(cuttingOrder.actual_end_date)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Ghi chú:</p>
                      <p className="text-sm font-semibold text-gray-900">{cuttingOrder.notes || '—'}</p>
                    </div>
                  </div>
                  
                  {/* Chỉ số tóm tắt */}
                  <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
                    <div className="rounded-lg bg-blue-50 p-4">
                      <h4 className="text-xs font-medium uppercase text-blue-600">Tổng chiều dài theo kế hoạch</h4>
                      <p className="mt-2 text-2xl font-bold text-blue-800">{totalPlannedConsumption.toLocaleString('vi-VN')} m</p>
                    </div>
                    <div className="rounded-lg bg-green-50 p-4">
                      <h4 className="text-xs font-medium uppercase text-green-600">Tổng chiều dài đã xuất</h4>
                      <p className="mt-2 text-2xl font-bold text-green-800">{issuedLength.toLocaleString('vi-VN')} m</p>
                    </div>
                    <div className="rounded-lg bg-purple-50 p-4">
                      <h4 className="text-xs font-medium uppercase text-purple-600">Tổng chiều dài thực tế sử dụng</h4>
                      <p className="mt-2 text-2xl font-bold text-purple-800">{totalActualConsumption.toLocaleString('vi-VN')} m</p>
                    </div>
                    <div className="rounded-lg bg-red-50 p-4">
                      <h4 className="text-xs font-medium uppercase text-red-600">Tỷ lệ hao hụt trung bình</h4>
                      <p className="mt-2 text-2xl font-bold text-red-800">{averageWastePercent.toFixed(2)}%</p>
                    </div>
                  </div>
                  
                  {/* Chi tiết vải */}
                  <div className="mb-6">
                    <h4 className="mb-4 text-md font-medium text-gray-900">Chi tiết vải sử dụng</h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 border">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                              Loại vải
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                              Chiều dài marker (m)
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                              Số lớp
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                              Số bộ
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                              Chiều dài yêu cầu (m)
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                              Chiều dài đã xuất (m)
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                              Chiều dài sử dụng (m)
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                              Hao hụt (m)
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                              Tỷ lệ hao hụt
                            </th>
                            <th scope="col" className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                              Thao tác
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                          {cuttingOrderDetails.map((detail) => (
                            <tr key={detail.id}>
                              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
                                {detail.fabric_name}
                              </td>
                              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                                {detail.marker_length}
                              </td>
                              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                                {detail.layers_count}
                              </td>
                              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                                {detail.pieces_count}
                              </td>
                              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                                {detail.required_length}
                              </td>
                              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                                {detail.fabric_issued_length}
                              </td>
                              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                                {detail.actual_consumed_length || '—'}
                              </td>
                              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                                {detail.waste_length || '—'}
                              </td>
                              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                                {detail.waste_percent ? `${detail.waste_percent.toFixed(2)}%` : '—'}
                              </td>
                              <td className="whitespace-nowrap px-4 py-3 text-center text-sm font-medium">
                                {(cuttingOrder.status === 'in-progress' || cuttingOrder.status === 'completed') && (
                                  <button
                                    type="button"
                                    onClick={() => handleOpenConsumptionForm(detail)}
                                    className="text-indigo-600 hover:text-indigo-900"
                                  >
                                    Cập nhật
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  {/* Form cập nhật tiêu thụ vải */}
                  {editMode && (
                    <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
                      <h4 className="mb-4 text-md font-medium text-gray-900">Cập nhật tiêu thụ vải</h4>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div>
                          <label htmlFor="actualConsumed" className="block text-sm font-medium text-gray-700">
                            Chiều dài thực tế sử dụng (m)
                          </label>
                          <input
                            type="number"
                            id="actualConsumed"
                            name="actualConsumed"
                            min="0"
                            step="0.1"
                            value={consumptionFormData.actualConsumed}
                            onChange={handleConsumptionChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                          />
                        </div>
                        <div>
                          <label htmlFor="wasteLength" className="block text-sm font-medium text-gray-700">
                            Chiều dài hao hụt (m)
                          </label>
                          <input
                            type="number"
                            id="wasteLength"
                            name="wasteLength"
                            min="0"
                            step="0.1"
                            value={consumptionFormData.wasteLength}
                            onChange={handleConsumptionChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                          />
                        </div>
                        <div className="flex items-end">
                          <button
                            type="button"
                            onClick={handleSaveConsumption}
                            className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                          >
                            Lưu thông tin
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditMode(false)}
                            className="ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                          >
                            Hủy
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Phiếu xuất vải liên quan */}
                  <div>
                    <h4 className="mb-4 text-md font-medium text-gray-900">Phiếu xuất vải liên quan</h4>
                    {relatedIssues.length === 0 ? (
                      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center">
                        <p className="text-sm text-gray-500">Chưa có phiếu xuất vải nào cho lệnh cắt này</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 border">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Mã phiếu
                              </th>
                              <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Ngày xuất
                              </th>
                              <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Người xuất
                              </th>
                              <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Người nhận
                              </th>
                              <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Số cuộn
                              </th>
                              <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Tổng dài (m)
                              </th>
                              <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Trạng thái
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 bg-white">
                            {relatedIssues.map((issue) => (
                              <tr key={issue.id}>
                                <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-blue-600 hover:text-blue-900 hover:underline">
                                  {issue.issue_code}
                                </td>
                                <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                                  {formatDate(issue.issue_date)}
                                </td>
                                <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                                  {issue.issued_by_name}
                                </td>
                                <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                                  {issue.received_by_name}
                                </td>
                                <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                                  {issue.total_rolls}
                                </td>
                                <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                                  {issue.total_length}
                                </td>
                                <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                                  {issue.status === 'pending' ? 'Chờ xử lý' : 
                                   issue.status === 'completed' ? 'Hoàn thành' : 
                                   issue.status === 'cancelled' ? 'Đã hủy' : 
                                   issue.status}
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
              type="button"
              className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CuttingOrderDetail; 