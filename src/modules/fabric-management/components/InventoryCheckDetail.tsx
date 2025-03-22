import React from 'react';
import { InventoryCheck, InventoryCheckItem, FabricInventory } from '@/mocks-new/fabric-management.mock';

interface InventoryCheckDetailProps {
  check: InventoryCheck;
  items: InventoryCheckItem[];
  inventory: FabricInventory[];
  employees: { id: number; name: string; position: string }[];
  onEdit: () => void;
  onBack: () => void;
}

const InventoryCheckDetail: React.FC<InventoryCheckDetailProps> = ({
  check,
  items,
  inventory,
  employees,
  onEdit,
  onBack
}) => {
  // Helper function to get employee name by ID
  const getEmployeeName = (id: number): string => {
    const employee = employees.find(emp => emp.id === id);
    return employee ? employee.name : `Employee ${id}`;
  };

  // Helper function to get inventory item by ID
  const getInventoryItem = (id: number): FabricInventory | undefined => {
    return inventory.find(item => item.id === id);
  };

  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
            Chi tiết kiểm kê
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
            Mã kiểm kê: {check.check_code}
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={onEdit}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Chỉnh sửa
          </button>
          <button
            onClick={onBack}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Quay lại
          </button>
        </div>
      </div>
      <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-0">
        <dl className="sm:divide-y sm:divide-gray-200 dark:sm:divide-gray-700">
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Mã kiểm kê</dt>
            <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">{check.check_code}</dd>
          </div>
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Ngày kiểm kê</dt>
            <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">{formatDate(check.check_date)}</dd>
          </div>
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Người tạo</dt>
            <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">{getEmployeeName(check.created_by)}</dd>
          </div>
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Trạng thái</dt>
            <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                ${check.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' : 
                check.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100' : 
                'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}>
                {check.status === 'completed' ? 'Hoàn thành' : 
                 check.status === 'in-progress' ? 'Đang thực hiện' : 'Nháp'}
              </span>
            </dd>
          </div>
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Ghi chú</dt>
            <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">{check.notes || 'Không có ghi chú'}</dd>
          </div>
        </dl>
      </div>

      <div className="px-4 py-5 sm:px-6">
        <h4 className="text-lg font-medium text-gray-900 dark:text-white">Danh sách mặt hàng kiểm kê</h4>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Mã kho
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Số cuộn
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Số lượng system
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Số lượng thực tế
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Chênh lệch
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Lý do
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {items.length > 0 ? (
              items.map((item) => {
                const inventoryItem = getInventoryItem(item.inventory_id);
                return (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {inventoryItem ? inventoryItem.inventory_code : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {inventoryItem ? inventoryItem.roll_number : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {item.system_quantity} {inventoryItem ? inventoryItem.unit : 'm'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {item.actual_quantity} {inventoryItem ? inventoryItem.unit : 'm'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {(item.actual_quantity - item.system_quantity).toFixed(2)} {inventoryItem ? inventoryItem.unit : 'm'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {item.reason || 'Không có'}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  Không có dữ liệu chi tiết kiểm kê
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryCheckDetail; 