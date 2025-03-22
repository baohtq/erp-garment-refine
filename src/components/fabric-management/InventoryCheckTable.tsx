import React from 'react';
import { InventoryCheck } from '@/mocks-new/fabric-management.mock';

interface InventoryCheckTableProps {
  checks: InventoryCheck[];
  employees: { id: number; name: string; position: string }[];
  onViewDetail: (check: InventoryCheck) => void;
  onDelete: (id: number) => void;
}

const InventoryCheckTable: React.FC<InventoryCheckTableProps> = ({
  checks,
  employees,
  onViewDetail,
  onDelete
}) => {
  // Helper function to get employee name by ID
  const getEmployeeName = (id: number): string => {
    const employee = employees.find(emp => emp.id === id);
    return employee ? employee.name : `Employee ${id}`;
  };

  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Mã kiểm kê
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Ngày
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Người tạo
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Trạng thái
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {checks.length > 0 ? (
            checks.map((check) => (
              <tr key={check.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {check.check_code}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {formatDate(check.check_date)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {getEmployeeName(check.created_by)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${check.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' : 
                    check.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100' : 
                    'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}>
                    {check.status === 'completed' ? 'Hoàn thành' : 
                     check.status === 'in-progress' ? 'Đang thực hiện' : 'Nháp'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => onViewDetail(check)}
                    className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-4"
                  >
                    Xem
                  </button>
                  <button
                    onClick={() => onDelete(check.id)}
                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                Không có dữ liệu kiểm kê
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryCheckTable; 