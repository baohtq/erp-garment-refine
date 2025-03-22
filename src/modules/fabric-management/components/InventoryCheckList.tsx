import React from 'react';
import { InventoryCheck } from '../../mocks/fabric-management.mock';

interface InventoryCheckListProps {
  inventoryChecks: InventoryCheck[];
  onView: (check: InventoryCheck) => void;
  onEdit: (check: InventoryCheck) => void;
  onDelete: (checkId: number) => void;
}

const InventoryCheckList: React.FC<InventoryCheckListProps> = ({
  inventoryChecks,
  onView,
  onEdit,
  onDelete
}) => {
  // Hàm định dạng ngày giờ
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  // Render trạng thái phiếu kiểm kê
  const renderStatus = (status: string) => {
    let bgColor = '';
    let textColor = '';

    switch (status) {
      case 'draft':
        bgColor = 'bg-gray-100';
        textColor = 'text-gray-800';
        return (
          <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${bgColor} ${textColor}`}>
            Bản nháp
          </span>
        );
      case 'in-progress':
        bgColor = 'bg-yellow-100';
        textColor = 'text-yellow-800';
        return (
          <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${bgColor} ${textColor}`}>
            Đang tiến hành
          </span>
        );
      case 'completed':
        bgColor = 'bg-green-100';
        textColor = 'text-green-800';
        return (
          <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${bgColor} ${textColor}`}>
            Hoàn thành
          </span>
        );
      default:
        return (
          <span className="inline-flex rounded-full px-2 text-xs font-semibold leading-5 bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              Mã kiểm kê
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              Ngày kiểm kê
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              Trạng thái
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              Ghi chú
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              Ngày tạo
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {inventoryChecks.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                Không có dữ liệu phiếu kiểm kê
              </td>
            </tr>
          ) : (
            inventoryChecks.map((check) => (
              <tr key={check.id} className="hover:bg-gray-50">
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                  {check.check_code}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {formatDate(check.check_date)}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {renderStatus(check.status)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                  {check.notes || "—"}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {formatDate(check.created_at)}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-center text-sm font-medium">
                  <button
                    type="button"
                    onClick={() => onView(check)}
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                  >
                    Xem
                  </button>
                  {check.status !== 'completed' && (
                    <>
                      <button
                        type="button"
                        onClick={() => onEdit(check)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        Sửa
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(check.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Xóa
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryCheckList; 