import React from 'react';
import { QualityControlRecord } from '@/mocks-new/fabric-management.mock';

interface QualityControlTableProps {
  records: QualityControlRecord[];
  employees: { id: number; name: string; position: string }[];
  fabrics: { id: number; name: string; code: string }[];
  onViewDetail: (record: QualityControlRecord) => void;
  onDelete: (id: number) => void;
}

const QualityControlTable: React.FC<QualityControlTableProps> = ({
  records,
  employees,
  fabrics,
  onViewDetail,
  onDelete
}) => {
  // Helper function to get employee name by ID
  const getEmployeeName = (id: number): string => {
    const employee = employees.find(emp => emp.id === id);
    return employee ? employee.name : `Employee ${id}`;
  };

  // Helper function to get fabric name by ID
  const getFabricName = (id: number): string => {
    const fabric = fabrics.find(fab => fab.id === id);
    return fabric ? fabric.name : `Fabric ${id}`;
  };

  // Format date
  const formatDate = (dateString: string): string => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  // Get status badge class
  const getStatusBadgeClass = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'passed':
        return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  // Get grade badge class
  const getGradeBadgeClass = (grade: string): string => {
    switch (grade.toUpperCase()) {
      case 'A':
        return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
      case 'B':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100';
      case 'C':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100';
      case 'D':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100';
      case 'F':
        return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Lot/Roll
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Loại vải
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Ngày kiểm tra
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Người kiểm tra
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Trạng thái
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Xếp loại
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {records.length > 0 ? (
            records.map((record) => (
              <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {record.lotNumber}/{record.rollNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {getFabricName(record.fabricId)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {formatDate(record.inspectionDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {getEmployeeName(record.inspectorId)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(record.status)}`}>
                    {record.status === 'passed' ? 'Đạt' : 
                     record.status === 'failed' ? 'Không đạt' : 
                     record.status === 'pending' ? 'Đang xử lý' : record.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getGradeBadgeClass(record.grade)}`}>
                    {record.grade}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => onViewDetail(record)}
                    className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-4"
                  >
                    Xem
                  </button>
                  <button
                    onClick={() => onDelete(record.id)}
                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                Không có dữ liệu kiểm tra chất lượng
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default QualityControlTable; 