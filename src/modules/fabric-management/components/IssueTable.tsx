import React from 'react';
import { FabricIssue } from '@/mocks-new/fabric-management.mock';

interface IssueTableProps {
  issues: FabricIssue[];
  employees: { id: number; name: string; position: string }[];
  onViewDetail: (issue: FabricIssue) => void;
  onDelete: (id: number) => void;
}

const IssueTable: React.FC<IssueTableProps> = ({
  issues,
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
              Mã vấn đề
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Tiêu đề
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Ngày tạo
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Người tạo
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Trạng thái
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Mức độ
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {issues.length > 0 ? (
            issues.map((issue) => (
              <tr key={issue.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {issue.issue_code}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {issue.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {formatDate(issue.date_created)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {getEmployeeName(issue.created_by)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${issue.status === 'resolved' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' : 
                    issue.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100' : 
                    'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'}`}>
                    {issue.status === 'resolved' ? 'Đã giải quyết' : 
                     issue.status === 'in-progress' ? 'Đang xử lý' : 'Mới'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${issue.severity === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100' : 
                    issue.severity === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100' : 
                    'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'}`}>
                    {issue.severity === 'high' ? 'Cao' : 
                     issue.severity === 'medium' ? 'Trung bình' : 'Thấp'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => onViewDetail(issue)}
                    className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-4"
                  >
                    Xem
                  </button>
                  <button
                    onClick={() => onDelete(issue.id)}
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
                Không có vấn đề nào
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default IssueTable; 