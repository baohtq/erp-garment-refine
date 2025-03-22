import React from 'react';
import { FabricIssue, FabricIssueItem, FabricInventory } from '@/mocks-new/fabric-management.mock';

interface IssueDetailProps {
  issue: FabricIssue;
  items: FabricIssueItem[];
  inventory: FabricInventory[];
  employees: { id: number; name: string; position: string }[];
  onEdit: () => void;
  onBack: () => void;
}

const IssueDetail: React.FC<IssueDetailProps> = ({
  issue,
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
            Chi tiết vấn đề
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
            Mã vấn đề: {issue.issue_code}
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
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Tiêu đề</dt>
            <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">{issue.title}</dd>
          </div>
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Mô tả</dt>
            <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">{issue.description}</dd>
          </div>
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Ngày tạo</dt>
            <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">{formatDate(issue.date_created)}</dd>
          </div>
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Người tạo</dt>
            <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">{getEmployeeName(issue.created_by)}</dd>
          </div>
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Trạng thái</dt>
            <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                ${issue.status === 'resolved' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' : 
                issue.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100' : 
                'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'}`}>
                {issue.status === 'resolved' ? 'Đã giải quyết' : 
                 issue.status === 'in-progress' ? 'Đang xử lý' : 'Mới'}
              </span>
            </dd>
          </div>
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Mức độ nghiêm trọng</dt>
            <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                ${issue.severity === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100' : 
                issue.severity === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100' : 
                'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'}`}>
                {issue.severity === 'high' ? 'Cao' : 
                 issue.severity === 'medium' ? 'Trung bình' : 'Thấp'}
              </span>
            </dd>
          </div>
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Kho vải bị ảnh hưởng</dt>
            <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
              <ul className="border border-gray-200 dark:border-gray-700 rounded-md divide-y divide-gray-200 dark:divide-gray-700">
                {issue.affected_inventory.length > 0 ? (
                  issue.affected_inventory.map(inventoryId => {
                    const item = getInventoryItem(inventoryId);
                    return (
                      <li key={inventoryId} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                        <div className="w-0 flex-1 flex items-center">
                          <span className="ml-2 flex-1 w-0 truncate">
                            {item ? `${item.inventory_code} - ${item.fabric_name} (Cuộn: ${item.roll_number})` : `Kho #${inventoryId}`}
                          </span>
                        </div>
                      </li>
                    );
                  })
                ) : (
                  <li className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Không có kho vải nào bị ảnh hưởng</span>
                  </li>
                )}
              </ul>
            </dd>
          </div>
        </dl>
      </div>

      {items.length > 0 && (
        <>
          <div className="px-4 py-5 sm:px-6">
            <h4 className="text-lg font-medium text-gray-900 dark:text-white">Danh sách chi tiết vấn đề</h4>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Danh mục
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Mô tả
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Số lượng
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Đơn vị
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Ghi chú
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {item.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {item.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {item.unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {item.notes || 'Không có ghi chú'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default IssueDetail; 